// Presentation only: themes, accessible feedback and shared navigation context.
(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;
  try { preference = localStorage.getItem("victory-theme"); } catch { /* Storage can be unavailable. */ }
  const applyTheme = theme => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.setAttribute("aria-label", "Temă întunecată");
      button.setAttribute("title", theme === "dark" ? "Activează tema luminoasă" : "Activează tema întunecată");
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
  };
  applyTheme(preference === "light" || preference === "dark" ? preference : systemTheme.matches ? "dark" : "light");
  systemTheme.addEventListener("change", event => { if (!preference) applyTheme(event.matches ? "dark" : "light"); });

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        preference = root.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(preference);
        try { localStorage.setItem("victory-theme", preference); } catch { /* Keep the session theme. */ }
      });
    });
    document.querySelectorAll("[data-context-link]").forEach(link => { link.href = link.dataset.contextLink + window.location.search; });
    const club = new URLSearchParams(window.location.search).get("club");
    document.querySelectorAll("[data-club-name]").forEach(element => { element.textContent = club || "Club nespecificat"; });

    document.querySelectorAll(".field input, .field select").forEach(control => {
      const error = document.getElementById(`${control.id}-error`);
      if (!error) return;
      const updateError = () => {
        const invalid = !control.validity.valid;
        control.setAttribute("aria-invalid", String(invalid));
        error.hidden = !invalid;
        error.textContent = invalid ? control.validity.valueMissing ? "Completează acest câmp." : "Verifică valoarea introdusă." : "";
      };
      control.addEventListener("invalid", updateError);
      control.addEventListener("input", () => { if (control.getAttribute("aria-invalid") === "true") updateError(); });
      control.addEventListener("change", () => { if (control.getAttribute("aria-invalid") === "true") updateError(); });
    });
    document.querySelectorAll("form").forEach(form => {
      form.addEventListener("reset", () => {
        form.querySelectorAll("[aria-invalid]").forEach(control => control.removeAttribute("aria-invalid"));
        form.querySelectorAll(".field-error").forEach(error => { error.hidden = true; error.textContent = ""; });
      });
    });

    const modal = document.getElementById("popupModal");
    if (!modal) return;
    const closeButton = modal.querySelector(".close-btn");
    let returnFocus = null;
    let wasOpen = false;
    // Save focus before the existing submit handler disables the submit button.
    document.getElementById("karateForm")?.addEventListener("submit", () => {
      returnFocus = document.activeElement;
    }, true);
    const syncDialog = () => {
      const open = !modal.classList.contains("hidden");
      document.body.classList.toggle("dialog-open", open);
      if (open && !wasOpen) {
        if (document.activeElement !== document.body && !modal.contains(document.activeElement)) returnFocus = document.activeElement;
        closeButton.focus();
      }
      else if (!open && wasOpen && returnFocus?.isConnected) returnFocus.focus();
      wasOpen = open;
    };
    new MutationObserver(syncDialog).observe(modal, { attributes: true, attributeFilter: ["class"] });
    modal.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); closeButton.click(); }
      if (event.key === "Tab") {
        const controls = [...modal.querySelectorAll("button, a[href], input, select, [tabindex='0']")].filter(control => !control.disabled);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  });
})();
