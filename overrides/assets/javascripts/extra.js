// Custom JavaScript for better UX

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add scroll to top button
function addScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'scroll-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--md-primary-fg-color);
    color: var(--md-primary-bg-color);
    border: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
  `;
  
  button.addEventListener('click', scrollToTop);
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  });
  
  document.body.appendChild(button);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
}

// Add copy button to code blocks
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.innerHTML = '📋';
    button.className = 'copy-code-btn';
    button.title = 'Kodu kopyala';
    button.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
      opacity: 0;
    `;
    
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '✅';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        setTimeout(() => {
          button.innerHTML = '📋';
          button.style.background = 'rgba(255, 255, 255, 0.9)';
          button.style.color = 'black';
        }, 2000);
      } catch (err) {
        console.error('Kopyalama başarısız:', err);
      }
    });
    
    button.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });
    
    const pre = block.parentElement;
    if (pre) {
      pre.style.position = 'relative';
      pre.appendChild(button);
    }
  });
}

// Add reading progress bar
function addReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: var(--md-primary-fg-color);
    z-index: 1001;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.md-search__input');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape to close search
    if (e.key === 'Escape') {
      const searchInput = document.querySelector('.md-search__input');
      if (searchInput && document.activeElement === searchInput) {
        searchInput.blur();
      }
    }
    
    // Ctrl/Cmd + / for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const themeToggle = document.querySelector('[data-md-color-scheme]');
      if (themeToggle) {
        themeToggle.click();
      }
    }
  });
}

// Add loading animation
function addLoadingAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    .page-loading {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .page-loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  
  document.body.classList.add('page-loading');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
    }, 100);
  });
}

// Add table of contents highlighting
function addTocHighlighting() {
  const toc = document.querySelector('.md-nav--secondary');
  if (!toc) return;
  
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const tocLinks = toc.querySelectorAll('a');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        tocLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current link
        const currentLink = toc.querySelector(`a[href="#${entry.target.id}"]`);
        if (currentLink) {
          currentLink.classList.add('active');
          currentLink.style.color = 'var(--md-primary-fg-color)';
          currentLink.style.fontWeight = 'bold';
        }
      }
    });
  }, { threshold: 0.5 });
  
  headings.forEach(heading => {
    if (heading.id) {
      observer.observe(heading);
    }
  });
}

// Add image lazy loading
function addLazyLoading() {
  const images = document.querySelectorAll('img');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    if (!img.src) {
      img.classList.add('lazy');
      imageObserver.observe(img);
    }
  });
}

// Add search suggestions
function addSearchSuggestions() {
  const searchInput = document.querySelector('.md-search__input');
  if (!searchInput) return;
  
  const suggestions = [
    'Python', 'Django', 'OpenCV', 'Git', 'Docker', 'AWS', 'Lambda',
    'Serverless', 'Security', 'Clickjacking', 'XSS', 'CSRF',
    'Authentication', 'Authorization', 'Database', 'API', 'REST',
    'GraphQL', 'Testing', 'CI/CD', 'Deployment', 'Monitoring'
  ];
  
  let suggestionIndex = 0;
  
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value) {
      const interval = setInterval(() => {
        if (document.activeElement !== searchInput) {
          clearInterval(interval);
          return;
        }
        
        searchInput.placeholder = `Ara... (örn: ${suggestions[suggestionIndex]})`;
        suggestionIndex = (suggestionIndex + 1) % suggestions.length;
      }, 2000);
    }
  });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  addScrollToTopButton();
  addCopyButtons();
  addReadingProgress();
  addKeyboardShortcuts();
  addLoadingAnimation();
  addTocHighlighting();
  addLazyLoading();
  addSearchSuggestions();
});

// Service Worker removed for development stability
