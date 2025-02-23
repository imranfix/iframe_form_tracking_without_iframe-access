/**
 * Author: Md Hasanuzzaman
 * Email: webhasan24@gmail.com
 * Website: https://leomeasure.com
 * Linkedin: https://linkedin.com/md-h
 * Youtube: https://www.youtube.com/@LeoMeasure-nr3pf
 */
(function() {
    function leoMeasureIframeFormSubmitDataLayer() {
        var iframeSelector = 'iframe'; // Change as your iframe selector example: 'iframe#id-of-iframe'
    
        var iframe = document.querySelector(iframeSelector);
        var isFormSubmitted = false;
        var isInsideIframe = false;
        var isCodeExecuted = false;
        var iframeHeight;
    
        var observer = new MutationObserver(function (_mutationsList, observer) {
            var currentHeight = iframe.offsetHeight;
            var iframeHeightChange = Math.abs(((currentHeight - iframeHeight) / iframeHeight) * 100);
    
            if (!isFormSubmitted && iframeHeightChange > 40) {
                observer.disconnect();
    
                isFormSubmitted = true;
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    event: 'iframe_form_submit',
                    form_location: window.location.href,
                    iframe_id: iframe.getAttribute('id'),
                    iframe_class: iframe.getAttribute('class')
                });
            }
        });
    
        function handleMouseOver(event) {
            if (event.target.closest(iframeSelector)) {
                isInsideIframe = true;
            } else {
                isInsideIframe = false;
            }
        }
    
        function handleFormSubmission() {
            var formInsideIframe = iframe.contentDocument.querySelector('form');
    
            formInsideIframe.addEventListener('submit', function (event) {
                var formData = {};
                var formInputs = formInsideIframe.querySelectorAll('input, select, textarea');
    
                for (var i = 0; i < formInputs.length; i++) {
                    var input = formInputs[i];
                    if (input.type === 'radio') {
    
                        if (input.checked) {
                            formData[input.name] = input.value;
                        }
                    } else if (input.type === 'checkbox') {
                        if (!formData[input.name]) {
                            formData[input.name] = [];
                        }
                        if (input.checked) {
                            formData[input.name].push(input.value);
                        }
                    } else {
                        formData[input.name] = input.value;
                    }
                }
    
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'iframe_form_submit',
                    form_location: window.location.href,
                    iframe_id: iframe.getAttribute('id'),
                    iframe_class: iframe.getAttribute('class'),
                    user_inputs: formData
                });
            });
        }
    
        document.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('blur', function () {
    
            if (isInsideIframe && !isCodeExecuted) {
                isCodeExecuted = true;
                document.removeEventListener('mouseover', handleMouseOver);
    
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    event: 'iframe_form_start',
                    form_location: window.location.href,
                    iframe_id: iframe.getAttribute('id'),
                    iframe_class: iframe.getAttribute('class')
                });
    
                if (iframe.contentDocument) {
                    handleFormSubmission();
                } else {
                    iframeHeight = iframe.offsetHeight;
                    observer.observe(iframe, { attributes: true, childList: true, subtree: true });
                }
            }
        });
    }
    leoMeasureIframeFormSubmitDataLayer();
})()