/**
 * activity-ui.js - Bond Activity UI System
 * "Time spent with waifus is never wasted."
 */

// ===================================
// BOND ACTIVITY SYSTEM UI
// ===================================

let activityUpdateTimer = null;
let selectedActivityWaifu = null;

function renderActivityTab() {
  if (!window.waifuSystem) return;

  // Check for pending activity completion (AFK return)
  const pendingResult = window.waifuSystem.checkPendingActivity();
  if (pendingResult && pendingResult.success) {
    showActivityCompleteNotification(pendingResult);
  }

  // Populate waifu dropdown
  populateActivityWaifuDropdown();

  // Render current activity if any
  renderCurrentActivity();

  // Render available activities for selected waifu
  renderAvailableActivities();

  // Render activity history
  renderActivityHistory();

  // Setup event listeners (only once)
  setupActivityEventListeners();
}

function populateActivityWaifuDropdown() {
  const dropdown = document.getElementById('activity-waifu-dropdown');
  if (!dropdown || !window.waifuSystem) return;

  const unlockedWaifus = window.waifuSystem.getUnlockedWaifus();
  let html = '<option value="">-- Select Waifu --</option>';

  unlockedWaifus.forEach(waifu => {
    const template = window.WAIFU_TEMPLATES[waifu.id];
    if (template) {
      const selected = selectedActivityWaifu === waifu.id ? 'selected' : '';
      html += `<option value="${waifu.id}" ${selected}>${template.emoji} ${template.name} (Bond: ${Math.floor(waifu.bondLevel)})</option>`;
    }
  });

  dropdown.innerHTML = html;
}

function setupActivityEventListeners() {
  // Only setup once
  if (window.activityListenersSetup) return;
  window.activityListenersSetup = true;

  // Waifu dropdown change
  const dropdown = document.getElementById('activity-waifu-dropdown');
  if (dropdown) {
    dropdown.addEventListener('change', (e) => {
      selectedActivityWaifu = e.target.value || null;
      renderAvailableActivities();
    });
  }

  // Complete activity button
  const completeBtn = document.getElementById('complete-activity-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', completeCurrentActivity);
  }

  // Cancel activity button
  const cancelBtn = document.getElementById('cancel-activity-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelCurrentActivity);
  }
}

function renderCurrentActivity() {
  const container = document.getElementById('current-activity');
  const selectionContainer = document.getElementById('activity-selection');
  if (!container || !window.waifuSystem) return;

  const progress = window.waifuSystem.getActivityProgress();

  if (!progress) {
    container.classList.add('hidden');
    if (selectionContainer) selectionContainer.style.display = 'block';
    stopActivityUpdateTimer();
    return;
  }

  container.classList.remove('hidden');
  if (selectionContainer) selectionContainer.style.display = 'none';

  // Update activity display
  const emoji = document.getElementById('activity-emoji');
  const name = document.getElementById('activity-name');
  const waifuName = document.getElementById('activity-waifu-name');
  const progressFill = document.getElementById('activity-progress-fill');
  const timeRemaining = document.getElementById('activity-time-remaining');
  const dialogue = document.getElementById('activity-dialogue');
  const completeBtn = document.getElementById('complete-activity-btn');

  if (emoji) emoji.textContent = progress.activity.emoji;
  if (name) name.textContent = progress.activity.name;
  if (waifuName) waifuName.textContent = progress.waifu.name;
  if (progressFill) progressFill.style.width = `${progress.progress * 100}%`;
  if (timeRemaining) timeRemaining.textContent = progress.remainingFormatted;
  if (dialogue) dialogue.textContent = `"${progress.activity.dialogue.start[0]}"`;
  if (completeBtn) {
    completeBtn.disabled = !progress.isComplete;
    completeBtn.textContent = progress.isComplete ? 'Complete Activity!' : 'In Progress...';
  }

  // Start update timer if not running
  startActivityUpdateTimer();
}

function renderAvailableActivities() {
  const container = document.getElementById('available-activities');
  if (!container || !window.waifuSystem) return;

  if (!selectedActivityWaifu) {
    container.innerHTML = '<p class="empty-message">Select a waifu to see available activities.</p>';
    return;
  }

  // Check if in activity
  if (window.waifuSystem.isInActivity()) {
    container.innerHTML = '<p class="empty-message">Complete or cancel your current activity first.</p>';
    return;
  }

  const activities = window.waifuSystem.getAvailableActivities(selectedActivityWaifu);

  if (activities.length === 0) {
    container.innerHTML = '<p class="empty-message">No activities available for this waifu yet.</p>';
    return;
  }

  let html = '';

  // Also show locked activities as grayed out
  for (const [activityId, activity] of Object.entries(window.BOND_ACTIVITIES)) {
    const availableActivity = activities.find(a => a.id === activityId);
    const waifu = window.waifuSystem.getWaifu(selectedActivityWaifu);

    if (availableActivity) {
      // Available activity
      html += `
        <div class="activity-card ${availableActivity.isPreferred ? 'preferred' : ''} ${activity.timeRestriction === 'night' ? 'night-only' : ''}"
             onclick="startBondActivity('${activityId}')">
          <div class="activity-card-emoji">${activity.emoji}</div>
          <div class="activity-card-name">${activity.name}</div>
          <div class="activity-card-desc">${activity.description}</div>
          <div class="activity-card-stats">
            <span class="activity-card-bond ${availableActivity.isPreferred ? 'bonus' : ''}">+${availableActivity.effectiveBondGain} Bond</span>
            <span class="activity-card-time">${formatActivityTime(activity.duration)}</span>
          </div>
          ${availableActivity.isPreferred ? '<div style="font-size: 6px; color: var(--gold-accent); margin-top: 4px;">Preferred!</div>' : ''}
        </div>
      `;
    } else {
      // Locked activity
      const reason = getActivityLockReason(activity, waifu);
      html += `
        <div class="activity-card locked">
          <div class="activity-card-emoji">${activity.emoji}</div>
          <div class="activity-card-name">${activity.name}</div>
          <div class="activity-card-desc">${activity.description}</div>
          <div class="activity-card-requirement">${reason}</div>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

function getActivityLockReason(activity, waifu) {
  if (waifu.bondLevel < activity.unlockBond) {
    return `Requires Bond ${activity.unlockBond}`;
  }
  if (activity.timeRestriction === 'night' && !isNightTimeForActivity()) {
    return 'Night only (22:00-06:00)';
  }
  if (activity.requiresBuilding) {
    return `Requires ${activity.requiresBuilding.replace(/_/g, ' ')}`;
  }
  return 'Locked';
}

// Helper function to check night time for activities
function isNightTimeForActivity() {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}

function formatActivityTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${minutes}m`;
  return `${minutes}m ${secs}s`;
}

function startBondActivity(activityId) {
  if (!window.waifuSystem || !selectedActivityWaifu) return;

  const result = window.waifuSystem.startActivity(selectedActivityWaifu, activityId);

  if (result.success) {
    if (window.showFloatingText) {
      window.showFloatingText(`Started ${result.activity.name} with ${result.waifuName}!`, true);
    }
    renderActivityTab();
  } else {
    if (window.showFloatingText) {
      window.showFloatingText(result.error, false);
    }
  }
}

function completeCurrentActivity() {
  if (!window.waifuSystem) return;

  const result = window.waifuSystem.completeActivity();

  if (result.success) {
    showActivityCompleteNotification(result);
    renderActivityTab();
  } else {
    if (window.showFloatingText) {
      window.showFloatingText(result.error, false);
    }
  }
}

function showActivityCompleteNotification(result) {
  // Show floating text
  if (window.showFloatingText) {
    window.showFloatingText(`+${result.rewards.bondGained} Bond with ${result.waifuName}!`, true);

    // Show additional rewards
    if (result.rewards.item) {
      setTimeout(() => {
        window.showFloatingText(`Received: ${result.rewards.item.name}!`, true);
      }, 500);
    }

    if (result.rewards.secretDiscovered) {
      setTimeout(() => {
        window.showFloatingText('A secret was discovered!', true);
      }, 1000);
    }

    if (result.rewards.cultivationXP) {
      setTimeout(() => {
        window.showFloatingText(`+${result.rewards.cultivationXP} Cultivation XP!`, true);
      }, 1000);
    }
  }

  // Update waifu UI
  if (window.updateWaifuUI) {
    window.updateWaifuUI();
  }
}

function cancelCurrentActivity() {
  if (!window.waifuSystem) return;

  const result = window.waifuSystem.cancelActivity();

  if (result.success) {
    if (window.showFloatingText) {
      window.showFloatingText(result.message, false);
    }
    renderActivityTab();
  }
}

function renderActivityHistory() {
  const container = document.getElementById('activity-history');
  if (!container || !window.waifuSystem) return;

  const history = window.waifuSystem.activityHistory;

  if (!history || history.length === 0) {
    container.innerHTML = '<p class="empty-message">No activities completed yet.</p>';
    return;
  }

  // Show last 10 activities, most recent first
  const recent = history.slice(-10).reverse();

  let html = '';
  recent.forEach(entry => {
    const activity = window.BOND_ACTIVITIES[entry.activityId];
    const template = window.WAIFU_TEMPLATES[entry.waifuId];
    const timeAgo = getTimeAgo(entry.completedAt);

    html += `
      <div class="activity-history-item">
        <span class="history-emoji">${activity?.emoji || '?'}</span>
        <span class="history-text">
          <span class="history-waifu">${template?.name || 'Unknown'}</span>
          - ${activity?.name || 'Unknown Activity'}
        </span>
        <span class="history-bond">+${entry.bondGained}</span>
        <span class="history-time">${timeAgo}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function startActivityUpdateTimer() {
  if (activityUpdateTimer) return;

  activityUpdateTimer = setInterval(() => {
    if (!window.waifuSystem || !window.waifuSystem.isInActivity()) {
      stopActivityUpdateTimer();
      return;
    }

    const progress = window.waifuSystem.getActivityProgress();
    if (!progress) return;

    // Update progress bar and time
    const progressFill = document.getElementById('activity-progress-fill');
    const timeRemaining = document.getElementById('activity-time-remaining');
    const completeBtn = document.getElementById('complete-activity-btn');

    if (progressFill) progressFill.style.width = `${progress.progress * 100}%`;
    if (timeRemaining) timeRemaining.textContent = progress.remainingFormatted;
    if (completeBtn) {
      completeBtn.disabled = !progress.isComplete;
      completeBtn.textContent = progress.isComplete ? 'Complete Activity!' : 'In Progress...';
    }

    // Auto-render if complete
    if (progress.isComplete && completeBtn) {
      completeBtn.classList.add('pulse');
    }
  }, 1000);
}

function stopActivityUpdateTimer() {
  if (activityUpdateTimer) {
    clearInterval(activityUpdateTimer);
    activityUpdateTimer = null;
  }
}

// Make functions globally available
window.startBondActivity = startBondActivity;
window.renderActivityTab = renderActivityTab;
window.completeCurrentActivity = completeCurrentActivity;
window.cancelCurrentActivity = cancelCurrentActivity;

console.log('Activity UI system loaded');
