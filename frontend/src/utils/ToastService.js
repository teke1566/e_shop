export const showToast = (message, type = "success") => {
  const colors = {
    success: "#00a65a",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  };

  //  Create or find container
  let container = document.getElementById("amazon-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "amazon-toast-container";
    container.style.position = "fixed";
    container.style.top = "1rem";
    container.style.right = "1rem";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  //  Remove previous toast if any (Amazon-like behavior)
  const existingToast = container.querySelector(".amazon-toast");
  if (existingToast) {
    existingToast.remove();
  }

  //  Create toast element
  const toast = document.createElement("div");
  toast.className = "amazon-toast";
  toast.style.minWidth = "240px";
  toast.style.maxWidth = "300px";
  toast.style.borderRadius = "8px";
  toast.style.padding = "10px 14px";
  toast.style.color =
    type === "warning" ? "#111" : "#fff";
  toast.style.backgroundColor = colors[type] || "#17a2b8";
  toast.style.fontSize = "0.9rem";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
  toast.style.transition = "all 0.4s ease";
  toast.style.opacity = "0";
  toast.style.transform = "translateX(30px)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.justifyContent = "space-between";
  toast.style.gap = "8px";

  //  Add icon
  const icon = document.createElement("i");
  icon.className =
    type === "success"
      ? "bi bi-check-circle-fill"
      : type === "danger"
      ? "bi bi-x-circle-fill"
      : type === "warning"
      ? "bi bi-exclamation-triangle-fill"
      : "bi bi-info-circle-fill";
  icon.style.marginRight = "6px";
  icon.style.fontSize = "1.1rem";
  if (type === "warning") icon.style.color = "#111";
  else icon.style.color = "#fff";

  const text = document.createElement("span");
  text.textContent = message;

  //  Build and append
  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  // ✅ Auto remove after 2.5s with fade out
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
};
