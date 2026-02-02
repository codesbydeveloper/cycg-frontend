
(function () {
  const toggle = document.getElementById('views-toggle');
  const dropdown = document.getElementById('views-dropdown');
  const source = document.getElementById('views-source');

  if (!toggle || !dropdown || !source) return;

  let isOpen = false;
  let isCloned = false;

  var DROPDOWN_TRANSITION_MS = 600;

  var closeTimer = null;
  var HOVER_CLOSE_DELAY = 200;

  function ensureCloned() {
    if (isCloned) return;
    const clone = source.cloneNode(true);
    clone.classList.remove('hidden');
    clone.id = '';
    const closeBtn = clone.querySelector('#views-close-btn');
    if (closeBtn) {
      closeBtn.id = '';
      closeBtn.addEventListener('click', closeDropdown);
    }
    dropdown.appendChild(clone);
    isCloned = true;
  }

  const headerEl = dropdown.closest('header');

  function openDropdown() {
    if (isOpen) return;
    isOpen = true;
    if (headerEl) headerEl.classList.add('views-dropdown-open');
    ensureCloned();
    document.body.classList.add('overflow-hidden');
    dropdown.style.height = 'auto';
    var targetHeight = dropdown.offsetHeight;
    dropdown.style.height = '0px';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dropdown.style.height = targetHeight + 'px';
      });
    });
  }

  function closeDropdown() {
    if (!isOpen) return;
    isOpen = false;
    if (headerEl) headerEl.classList.remove('views-dropdown-open');
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = null;
    var currentHeight = dropdown.offsetHeight;
    dropdown.style.height = currentHeight + 'px';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dropdown.style.height = '0px';
        setTimeout(function () {
          document.body.classList.remove('overflow-hidden');
        }, DROPDOWN_TRANSITION_MS);
      });
    });
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(closeDropdown, HOVER_CLOSE_DELAY);
  }

  function cancelClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = null;
  }

  toggle.addEventListener('mouseenter', function () {
    cancelClose();
    openDropdown();
  });

  toggle.addEventListener('mouseleave', function () {
    scheduleClose();
  });

  dropdown.addEventListener('mouseenter', function () {
    cancelClose();
  });

  dropdown.addEventListener('mouseleave', function () {
    scheduleClose();
  });

  toggle.addEventListener('click', function (e) {
    e.preventDefault();
  });

  document.addEventListener('click', function (e) {
    if (isOpen && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeDropdown();
  });

  window.addEventListener('DOMContentLoaded', function () {
    if (window.location.hash === '#open') {
      if (!isCloned) {
        const clone = source.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        const closeBtn = clone.querySelector('#views-close-btn');
        if (closeBtn) {
          closeBtn.id = '';
          closeBtn.addEventListener('click', closeDropdown);
        }
        dropdown.appendChild(clone);
        isCloned = true;
      }
      setTimeout(openDropdown, 50);
    }
  });
})();
