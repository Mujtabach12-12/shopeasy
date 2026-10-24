// All jQuery code is kept inside document.ready in this file.
$(document).ready(function () {
  // Load products.json with jQuery and show loading / error feedback.
  const $loading = $("#loading-status");
  if ($loading.length) {
    $loading.text("Loading...").show();
    $.getJSON("products.json")
      .done(function (data) {
        if (!Array.isArray(data) || data.length < 10) {
          $loading.text("Product data is invalid. Showing local products.").addClass("status-error");
          setCatalog(products);
          return;
        }
        setCatalog(data);
        $loading.hide();
      })
      .fail(function () {
        $loading.text("Could not load products.json. Use VS Code Live Server. Showing local products.").addClass("status-error");
        setCatalog(products);
      });
  }

  // Effect 1: each FAQ answer opens/closes with slideToggle.
  $(".faq-question").on("click", function () {
    const $question = $(this);
    const expanded = $question.attr("aria-expanded") === "true";
    $question.attr("aria-expanded", String(!expanded)).toggleClass("is-open");
    $question.find("span").text(expanded ? "+" : "−");
    $question.next(".faq-answer").stop(true, true).slideToggle(220);
  });

  // Effect 2: cards fade in whenever plain JavaScript renders them.
  $(document).on("catalogRendered", function () {
    $(".product-card").hide().fadeIn(350);
  });

  // Effect 3 + method chaining: cart feedback fades in and fades out.
  $(document).on("shopEasyMessage", function (event) {
    const text = event.originalEvent.detail;
    $("#toast").stop(true, true).text(text).fadeIn(180).delay(1300).fadeOut(400);
  });
});
