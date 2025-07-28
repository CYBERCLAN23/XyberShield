   function nextInput(step) {
      const currentInput = document.querySelector(`#group-${step} input`);
      const nextGroup = document.getElementById(`group-${step + 1}`);
      const loading = document.getElementById(`loading-${step + 1}`);

      if (currentInput.value.trim() !== "" && nextGroup && !nextGroup.classList.contains('active')) {
        // Show loading
        loading.style.display = "block";

        // After delay, hide loading and show next input
        setTimeout(() => {
          loading.style.display = "none";
          nextGroup.classList.add("active");
        }, 1000); // 1 second delay
      }
    }