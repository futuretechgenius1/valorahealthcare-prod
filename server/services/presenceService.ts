import { pool } from '../db';

interface AgentPresence {
  userId: number;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  lastSeen: number;
}

const activeAgentsMap = new Map<number, AgentPresence>();
const STALE_HEARTBEAT_MS = 90 * 1000; // 90 seconds

/**
 * Record a heartbeat from an authenticated admin agent
 */
export async function updateAgentHeartbeat(userId: number, name: string, role: string, status?: 'online' | 'busy' | 'offline') {
  const existing = activeAgentsMap.get(userId);
  const currentStatus = status || existing?.status || 'online';

  activeAgentsMap.set(userId, {
    userId,
    name,
    role,
    status: currentStatus,
    lastSeen: Date.now(),
  });

  try {
    await pool.query(
      'UPDATE admin_users SET presence_status = ?, last_active_at = NOW() WHERE id = ?',
      [currentStatus, userId]
    );
  } catch (err) {
    // quiet fallback
  }
}

/**
 * Manually update agent status (e.g. from header dropdown)
 */
export async function setAgentStatus(userId: number, status: 'online' | 'busy' | 'offline') {
  const agent = activeAgentsMap.get(userId);
  if (agent) {
    agent.status = status;
    agent.lastSeen = Date.now();
  }

  try {
    await pool.query(
      'UPDATE admin_users SET presence_status = ?, last_active_at = NOW() WHERE id = ?',
      [status, userId]
    );
  } catch (err) {
    // quiet fallback
  }
}

/**
 * Clean up stale agents and get current summary
 */
export function getAgentPresenceSummary(): {
  onlineCount: number;
  busyCount: number;
  offlineCount: number;
  isHumanAvailable: boolean;
  activeAgents: Array<{ id: number; name: string; role: string; status: string }>;
} {
  const now = Date.now();
  const activeList: Array<{ id: number; name: string; role: string; status: string }> = [];
  let onlineCount = 0;
  let busyCount = 0;

  for (const [userId, agent] of activeAgentsMap.entries()) {
    if (now - agent.lastSeen > STALE_HEARTBEAT_MS) {
      // Mark stale agents as offline
      activeAgentsMap.delete(userId);
      pool.query('UPDATE admin_users SET presence_status = "offline" WHERE id = ?', [userId]).catch(() => {});
    } else {
      activeList.push({
        id: agent.userId,
        name: agent.name,
        role: agent.role,
        status: agent.status,
      });
      if (agent.status === 'online') onlineCount++;
      if (agent.status === 'busy') busyCount++;
    }
  }

  return {
    onlineCount,
    busyCount,
    offlineCount: Math.max(0, 1 - (onlineCount + busyCount)),
    isHumanAvailable: onlineCount > 0,
    activeAgents: activeList,
  };
}
