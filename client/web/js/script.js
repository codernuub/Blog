
        var Tawk_API = Tawk_API || {},
          Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script"),
            s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "https://embed.tawk.to/5f086e9f67771f3813c0cc1c/default";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
     

   
        function backToTop() {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
    
        function openNav() {
          document.getElementById("mySidenav").style.width = "250px";
        }

        function closeNav() {
          document.getElementById("mySidenav").style.width = "0";
        }
    
        let dropdowns = document.querySelectorAll(".navbar .dropdown-toggler");
        let dropdownIsOpen = false;

        if (dropdowns.length) {
          dropdowns.forEach((dropdown) => {
            dropdown.addEventListener("click", (event) => {
              let target = document.querySelector(
                `#${event.target.dataset.dropdown}`,
              );

              if (target) {
                if (target.classList.contains("show")) {
                  target.classList.remove("show");
                  dropdownIsOpen = false;
                } else {
                  target.classList.add("show");
                  dropdownIsOpen = true;
                }
              }
            });
          });
        }

        // Handle closing dropdowns if a user clicked the body
        window.addEventListener("mouseup", (event) => {
          if (dropdownIsOpen) {
            dropdowns.forEach((dropdownButton) => {
              let dropdown = document.querySelector(
                `#${dropdownButton.dataset.dropdown}`,
              );
              let targetIsDropdown = dropdown == event.target;

              if (dropdownButton == event.target) {
                return;
              }

              if (!targetIsDropdown && !dropdown.contains(event.target)) {
                dropdown.classList.remove("show");
              }
            });
          }
        });

        // Open links in mobiles
        function handleSmallScreens() {
          document
            .querySelector(".navbar-toggler")
            .addEventListener("click", () => {
              let navbarMenu = document.querySelector(".navbar-menu");

              if (navbarMenu.style.display === "flex") {
                navbarMenu.style.display = "none";
                return;
              }

              navbarMenu.style.display = "flex";
            });
        }

        handleSmallScreens();
     
        function animateValue(obj, start, end, duration) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            );
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }

        // const obj = document.getElementById("value");
        // animateValue(obj, 0, 50, 5000);
        const els = [...document.querySelectorAll("#value")];
        els.forEach((els) => {
          console.log(Number.parseInt(els.textContent));
          animateValue(els, 0, Number.parseInt(els.textContent), 5000);
        });