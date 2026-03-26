/**
 * Pre-order handler (IAMSOL)
 * Fixes: button reverting to "ADD TO CART" after variant switch
 * - Listens to theme variant change events and re-applies preorder UI
 * - Also re-runs after form input "id" changes
 */
(function () {
  function parseJSONScript(el) {
    try {
      return JSON.parse(el.textContent || "{}");
    } catch (e) {
      return {};
    }
  }

  function getCurrentVariantId(sectionId) {
    const btn = document.getElementById(`ProductSubmitButton-${sectionId}`);
    const form = btn ? btn.closest("form") : null;
    const idInput = form ? form.querySelector('input[name="id"]') : null;
    return idInput && idInput.value ? Number(idInput.value) : null;
  }

  function computePreorderState(data, variantId) {
    const out = {
      isPreorder: false,
      buttonText: null,
      dispatchText: "",
      forceEnable: false
    };

    if (!data || !data.enabled || !Array.isArray(data.variants)) return out;

    const v = data.variants.find((x) => Number(x.id) === Number(variantId));
    if (!v) return out;

    const inv = Number(v.inventory_quantity || 0);

    // In stock -> normal
    if (inv > 0) return out;

    // Out of stock: apply preorder if limits allow
    // Example: inv = -3, limit = 10 -> remaining = 7
    const remaining1 = Math.max(0, Number(v.preorder_limit || 0) + inv);
    const remaining2 = Math.max(0, Number(v.preorder_limit2 || 0) + inv);

    if (remaining1 > 0) {
      out.isPreorder = true;
      out.buttonText = "Pre-Order";
      out.dispatchText = (v.preorder_dispatch_date || data.product_dispatch_date || "").toString();
      out.forceEnable = true;
      return out;
    }

    if (remaining2 > 0) {
      out.isPreorder = true;
      out.buttonText = "Pre-Order";
      out.dispatchText = (v.preorder_dispatch_date2 || data.product_dispatch_date || "").toString();
      out.forceEnable = true;
      return out;
    }

    // Limits reached => no preorder
    return out;
  }

  function applyToMain(sectionId, data, variantId) {
    const btn = document.getElementById(`ProductSubmitButton-${sectionId}`);
    const textEl = document.getElementById(`preorder-custom-text-${sectionId}`);
    if (!btn) return;

    const state = computePreorderState(data, variantId);

    if (state.isPreorder) {
      const span = btn.querySelector("span");
      if (span) span.textContent = state.buttonText;

      if (state.forceEnable) btn.removeAttribute("disabled");

      if (textEl) textEl.textContent = state.dispatchText ? state.dispatchText : "";
      return;
    }

    // Not preorder
    if (textEl) textEl.textContent = "";
  }

  function applyToSticky(data, variantId) {
    const stickyBtn = document.querySelector(".sticky-atc-bar button[name='add']");
    if (!stickyBtn) return;

    const state = computePreorderState(data, variantId);

    if (!state.isPreorder) return;

    const span = stickyBtn.querySelector("span");
    if (span) span.textContent = state.buttonText;

    if (state.forceEnable) stickyBtn.removeAttribute("disabled");
  }

  function loadSectionData(sectionId) {
    const jsonEl = document.getElementById(`PreorderData-${sectionId}`);
    if (!jsonEl) return null;
    return parseJSONScript(jsonEl);
  }

  function run(sectionId) {
    const data = loadSectionData(sectionId);
    if (!data) return;

    const variantId = getCurrentVariantId(sectionId);
    if (!variantId) return;

    applyToMain(sectionId, data, variantId);
    applyToSticky(data, variantId);
  }

  // Run for all sections on the page (safe if there is only one)
  function runAllSectionsWithDelay(delayMs) {
    document.querySelectorAll('script[id^="PreorderData-"]').forEach((el) => {
      const sectionId = el.id.replace("PreorderData-", "");
      setTimeout(() => run(sectionId), delayMs);
    });
  }

  // Attach to the product form "id" input changes (extra reliable fallback)
  function attachIdInputWatcher(sectionId) {
    const btn = document.getElementById(`ProductSubmitButton-${sectionId}`);
    const form = btn ? btn.closest("form") : null;
    if (!form) return;

    const idInput = form.querySelector('input[name="id"]');
    if (!idInput) return;

    // Avoid duplicate listeners
    if (idInput.dataset.preorderWatcherAttached === "1") return;
    idInput.dataset.preorderWatcherAttached = "1";

    const handler = () => run(sectionId);

    idInput.addEventListener("change", handler);
    idInput.addEventListener("input", handler);

    // Some themes update the input value programmatically without events,
    // so observe attribute changes too.
    try {
      const mo = new MutationObserver(() => run(sectionId));
      mo.observe(idInput, { attributes: true, attributeFilter: ["value"] });
    } catch (e) {
      // ignore
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Initial run
    document.querySelectorAll('script[id^="PreorderData-"]').forEach((el) => {
      const sectionId = el.id.replace("PreorderData-", "");
      run(sectionId);
      attachIdInputWatcher(sectionId);
    });

    /**
     * 1) MOST RELIABLE: IAMSOL theme dispatches this event on variant switch
     * We delay slightly to let theme re-render button label/disabled state first,
     * then we override to Pre-Order if needed.
     */
    document.addEventListener("variant:changed", function () {
      runAllSectionsWithDelay(30);
    });

    /**
     * 2) If FoxTheme pubsub exists, subscribe (depends on load order)
     * NOTE: PUB_SUB_EVENTS is usually a global, not window.PUB_SUB_EVENTS
     */
    if (window.FoxThemeEvents && typeof PUB_SUB_EVENTS !== "undefined") {
      window.FoxThemeEvents.subscribe(PUB_SUB_EVENTS.variantChange, function (evt) {
        const sectionId = evt && evt.data && evt.data.sectionId ? evt.data.sectionId : null;
        if (!sectionId) {
          runAllSectionsWithDelay(30);
          return;
        }
        setTimeout(() => run(sectionId), 30);
      });
    }
  });
})();
