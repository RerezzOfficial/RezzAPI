       // Theme Toggle
       const themeToggle = document.getElementById('themeToggle');
       const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
       let currentTheme = localStorage.getItem('theme') || 'light';

       function setTheme(theme) {
           document.documentElement.setAttribute('data-theme', theme);
           localStorage.setItem('theme', theme);
           
           if (theme === 'dark') {
               themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
           } else {
               themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
           }
       }

       setTheme(currentTheme);

       themeToggle.addEventListener('click', () => {
           const newTheme = currentTheme === 'light' ? 'dark' : 'light';
           setTheme(newTheme);
           currentTheme = newTheme;
       });

       // Mobile Menu Toggle
       const menuToggle = document.getElementById('menuToggle');
       const navLinks = document.querySelector('.nav-links');
       const headerActions = document.querySelector('.header-actions');

       menuToggle.addEventListener('click', () => {
           const isOpen = navLinks.style.display === 'flex';
           
           if (isOpen) {
               navLinks.style.display = 'none';
               headerActions.style.display = 'none';
               menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
           } else {
               navLinks.style.display = 'flex';
               headerActions.style.display = 'flex';
               navLinks.style.flexDirection = 'column';
               navLinks.style.position = 'absolute';
               navLinks.style.top = '100%';
               navLinks.style.left = '0';
               navLinks.style.width = '100%';
               navLinks.style.backgroundColor = 'var(--card-bg)';
               navLinks.style.padding = '20px';
               navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
               
               headerActions.style.flexDirection = 'column';
               headerActions.style.position = 'relative';
               headerActions.style.width = '100%';
               headerActions.style.padding = '20px';
               headerActions.style.gap = '15px';
               
               menuToggle.innerHTML = '<i class="fas fa-times"></i>';
           }
       });

       // Smooth Scrolling
       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
           anchor.addEventListener('click', function(e) {
               e.preventDefault();
               
               const targetId = this.getAttribute('href');
               const targetElement = document.querySelector(targetId);
               
               if (targetElement) {
                   window.scrollTo({
                       top: targetElement.offsetTop - 80,
                       behavior: 'smooth'
                   });
                   
                   // Close mobile menu if open
                   if (navLinks.style.display === 'flex') {
                       navLinks.style.display = 'none';
                       headerActions.style.display = 'none';
                       menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                   }
               }
           });
       });

       // Canvas Functionality
       const canvas = document.getElementById('drawingCanvas');
       const ctx = canvas.getContext('2d');
       const colorPicker = document.getElementById('colorPicker');
       const brushSize = document.getElementById('brushSize');
       const brushSizeValue = document.getElementById('brushSizeValue');
       const clearCanvas = document.getElementById('clearCanvas');
       
       function resizeCanvas() {
           const container = canvas.parentElement;
           canvas.width = container.offsetWidth;
           canvas.height = 500;
       }
       
       window.addEventListener('load', resizeCanvas);
       window.addEventListener('resize', resizeCanvas);
       
       let isDrawing = false;
       let lastX = 0;
       let lastY = 0;
       
       ctx.strokeStyle = colorPicker.value;
       ctx.lineWidth = brushSize.value;
       ctx.lineJoin = 'round';
       ctx.lineCap = 'round';
       
       brushSizeValue.textContent = `${brushSize.value}px`;
       
       // Mouse Events
       canvas.addEventListener('mousedown', startDrawing);
       canvas.addEventListener('mousemove', draw);
       canvas.addEventListener('mouseup', stopDrawing);
       canvas.addEventListener('mouseout', stopDrawing);
       
       // Touch Events
       canvas.addEventListener('touchstart', handleTouch);
       canvas.addEventListener('touchmove', handleTouch);
       canvas.addEventListener('touchend', stopDrawing);
       
       function handleTouch(e) {
           e.preventDefault();
           const touch = e.touches[0];
           const mouseEvent = new MouseEvent(
               e.type === 'touchstart' ? 'mousedown' : 'mousemove', 
               {
                   clientX: touch.clientX,
                   clientY: touch.clientY
               }
           );
           canvas.dispatchEvent(mouseEvent);
       }
       
       function startDrawing(e) {
           isDrawing = true;
           [lastX, lastY] = [e.offsetX, e.offsetY];
       }
       
       function draw(e) {
           if (!isDrawing) return;
           
           ctx.beginPath();
           ctx.moveTo(lastX, lastY);
           ctx.lineTo(e.offsetX, e.offsetY);
           ctx.stroke();
           
           [lastX, lastY] = [e.offsetX, e.offsetY];
       }
       
       function stopDrawing() {
           isDrawing = false;
       }
       
       colorPicker.addEventListener('input', (e) => {
           ctx.strokeStyle = e.target.value;
       });
       
       brushSize.addEventListener('input', (e) => {
           ctx.lineWidth = e.target.value;
           brushSizeValue.textContent = `${e.target.value}px`;
       });
       
       clearCanvas.addEventListener('click', () => {
           ctx.clearRect(0, 0, canvas.width, canvas.height);
       });

       // Form Submission
       const contactForm = document.querySelector('.contact-form form');
       contactForm.addEventListener('submit', (e) => {
           e.preventDefault();
           alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
           contactForm.reset();
       });
