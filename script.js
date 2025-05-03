// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    try {
        const desktopThemeToggle = document.querySelector('.desktop-theme-toggle');
        const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
        const body = document.body;
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        // Function to update theme
        function updateTheme(theme) {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeIcons(theme);
        }

        // Function to update all theme icons
        function updateThemeIcons(theme) {
            const themeToggles = document.querySelectorAll('.theme-toggle');
            themeToggles.forEach(toggle => {
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            });
        }

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        updateTheme(savedTheme);

        // Add click handlers to both toggles
        [desktopThemeToggle, mobileThemeToggle].forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const currentTheme = body.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    updateTheme(newTheme);
                });
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                updateTheme(newTheme);
            }
        });

        // Mobile menu theme toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.toggle('active');
                    mobileMenuBtn.classList.toggle('active');
                    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                        '<i class="fas fa-times"></i>' : 
                        '<i class="fas fa-bars"></i>';
                }
            });
        }
    } catch (error) {
        console.error('Error in theme toggle:', error);
    }
});

// Enhanced Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error in smooth scrolling:', error);
    }
});

// Enhanced Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    try {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up', 'scroll-down');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;

            // Add scroll class for additional styling
            scrollTimeout = setTimeout(() => {
                navbar.classList.add('scrolled');
            }, 100);
        });
    } catch (error) {
        console.error('Error in navbar scroll effect:', error);
    }
});

// Portfolio Filtering
document.addEventListener('DOMContentLoaded', function() {
    try {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterButtons.length && projectCards.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');

                    const filter = button.getAttribute('data-filter');

                    projectCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 100);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    } catch (error) {
        console.error('Error in portfolio filtering:', error);
    }
});

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    try {
        emailjs.init("U3eMRXs9xU-xLhpat");
        console.log("EmailJS initialized successfully");
    } catch (error) {
        console.error("EmailJS initialization failed:", error);
        showNotification("Email service initialization failed. Please try again later.", "error");
    }

    const contactForm = document.getElementById('contact-form');
    const sendBtn = document.querySelector('.send-btn');
    const btnText = document.querySelector('.btn-text');
    const btnIcon = document.querySelector('.btn-icon');
    const btnLoading = document.querySelector('.btn-loading');

    if (!contactForm || !sendBtn || !btnText || !btnIcon || !btnLoading) {
        console.error('Required form elements not found');
        showNotification("Form elements not found. Please refresh the page.", "error");
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form data
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !subject || !message) {
            showNotification("Please fill in all fields", "error");
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showNotification("Please enter a valid email address", "error");
            return;
        }
        
        // Show loading state
        if (sendBtn && btnText) {
            sendBtn.classList.add('loading');
            btnText.textContent = 'Sending...';
        }
        
        try {
            // Get form data
            const formData = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };

            console.log('Form data:', formData);

            // Send email using EmailJS
            const response = await emailjs.send(
                "service_c7r06qu", // Replace this with your actual service ID
                "template_phi6soj", // Replace this with your actual template ID
                formData
            ).then(
                function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification("Message sent successfully!", "success");
                    
                    // Show success state
                    if (sendBtn && btnText) {
                        sendBtn.classList.remove('loading');
                        sendBtn.classList.add('success');
                        btnText.textContent = 'Message Sent!';
                    }
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button state after 3 seconds
                    setTimeout(() => {
                        if (sendBtn && btnText) {
                            sendBtn.classList.remove('success');
                            btnText.textContent = 'Send Message';
                        }
                    }, 3000);
                },
                function(error) {
                    console.log('FAILED...', error);
                    let errorMessage = "Failed to send message. ";
                    
                    if (error.text.includes("service ID not found")) {
                        errorMessage += "Service ID is incorrect. Please contact support.";
                    } else if (error.text.includes("template ID not found")) {
                        errorMessage += "Template ID is incorrect. Please contact support.";
                    } else {
                        errorMessage += "Please try again later.";
                    }
                    
                    showNotification(errorMessage, "error");
                    throw error;
                }
            );

        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Show error state
            if (sendBtn && btnText) {
                sendBtn.classList.remove('loading');
                sendBtn.classList.add('error');
                btnText.textContent = 'Error! Try Again';
            }
            
            // Reset button state after 3 seconds
            setTimeout(() => {
                if (sendBtn && btnText) {
                    sendBtn.classList.remove('error');
                    btnText.textContent = 'Send Message';
                }
            }, 3000);
        }
    });
});

// Enhanced Notification System
function showNotification(message, type) {
    try {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Error in notification system:', error);
    }
}

// Enhanced Section Animations
document.addEventListener('DOMContentLoaded', function() {
    try {
        const sections = document.querySelectorAll('section');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    } catch (error) {
        console.error('Error in section animations:', error);
    }
});

// Enhanced Typing Effect
document.addEventListener('DOMContentLoaded', function() {
    try {
        const typingTexts = document.querySelectorAll('.typing-text');
        const cursor = document.querySelector('.cursor');
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let deletingSpeed = 50;
        let pauseTime = 2000;

        // Store original texts
        const originalTexts = Array.from(typingTexts).map(text => text.textContent);
        
        // Clear all texts initially
        typingTexts.forEach(text => {
            text.textContent = '';
        });

        function type() {
            const currentText = originalTexts[currentTextIndex];
            
            if (isDeleting) {
                // Delete character
                typingTexts[currentTextIndex].textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = deletingSpeed;
            } else {
                // Add character
                typingTexts[currentTextIndex].textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;
            }

            // Check if we've reached the end of the current text
            if (!isDeleting && currentCharIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = pauseTime;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                // Hide current text and show next
                typingTexts[currentTextIndex].style.display = 'none';
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                typingTexts[currentTextIndex].style.display = 'inline';
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing effect
        if (typingTexts.length > 0) {
            // Show only the first text initially
            typingTexts.forEach((text, index) => {
                text.style.display = index === 0 ? 'inline' : 'none';
            });
            type();
        }

        // Cursor animation
        if (cursor) {
            let cursorVisible = true;
            setInterval(() => {
                cursorVisible = !cursorVisible;
                cursor.style.opacity = cursorVisible ? '1' : '0';
            }, 500);
        }
    } catch (error) {
        console.error('Error in typing effect:', error);
    }
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links a');

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target) && 
                navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close mobile menu when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Fix for iOS Safari 100vh issue
        function setVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 60;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error initializing mobile menu:', error);
    }
});

// Project Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    try {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'var(--shadow-md)';
            });
        });
    } catch (error) {
        console.error('Error in project card animations:', error);
    }
});

// Profile Image Hover Effect
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.05)';
    });
    
    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1)';
    });
}

// Social Links Hover Effect
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Modern UI Interactions
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Smooth Scroll with Offset
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });

        // Typing Effect
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            let i = 0;

            function type() {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100);
                }
            }

            type();
        }

        // Project Card Hover Effect
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Form Validation with Modern Feedback
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitButton = this.querySelector('.send-btn');
                
                // Add loading state
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    
                    // Show success message
                    showNotification('Message sent successfully!', 'success');
                    this.reset();
                }, 2000);
            });
        }

        // Modern Notification System
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // Add CSS for notifications
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: var(--radius-md);
                color: white;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification.success {
                background: linear-gradient(45deg, #10B981, #059669);
            }
            
            .notification.error {
                background: linear-gradient(45deg, #EF4444, #DC2626);
            }
            
            .notification i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);

        // Intersection Observer for Section Animations
        const sections = document.querySelectorAll('section');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Add CSS for section animations
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            section {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            section.animate {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(animationStyle);

    } catch (error) {
        console.error('Error initializing UI interactions:', error);
    }
});

// Scroll Down Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollDownButton = document.querySelector('.scroll-down');
    const aboutSection = document.querySelector('#about');

    if (scrollDownButton && aboutSection) {
        scrollDownButton.addEventListener('click', function() {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Add scroll event listener to hide button when scrolling down
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                scrollDownButton.style.opacity = '0';
                scrollDownButton.style.visibility = 'hidden';
            } else {
                // Scrolling up
                scrollDownButton.style.opacity = '1';
                scrollDownButton.style.visibility = 'visible';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}); 