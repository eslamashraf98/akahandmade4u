
// uppage

window.onscroll = function() {myFunction()};

let UpPage = document.querySelector(".uppage")

function myFunction() {
  if (window.scrollY <= 1000) {
    UpPage.style.opacity = 0;
  } else {
    UpPage.style.opacity = 0.5;
    UpPage.style.transition = .5;
 }};



// //  swipe

// var swipe = document.querySelectorAll(".swipe");
// var swipes = document.querySelectorAll(".swipes");

// var x = window.matchMedia("(max-width: 450px;)")
// myFunction(x) // Call listener function at run time
// x.addListener(myFunction) 

// function myFunction(x){
//   if (x.matches) {
//     swipe.style.display = "block";
//     swipes.style.display = "block";

//   } else {
//     swipe.style.display = "none";
//     swipes.style.display = "none";
//  }
//  };




    // Utility function
    function Util() { };

    /* 
        class manipulation functions
    */
    Util.hasClass = function (el, className) {
        if (el.classList) return el.classList.contains(className);
        else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };

    Util.addClass = function (el, className) {
        var classList = className.split(' ');
        if (el.classList) el.classList.add(classList[0]);
        else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
        if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
    };

    Util.removeClass = function (el, className) {
        var classList = className.split(' ');
        if (el.classList) el.classList.remove(classList[0]);
        else if (Util.hasClass(el, classList[0])) {
            var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
        if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
    };

    Util.toggleClass = function (el, className, bool) {
        if (bool) Util.addClass(el, className);
        else Util.removeClass(el, className);
    };

    Util.setAttributes = function (el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };

    /* 
      DOM manipulation
    */
    Util.getChildrenByClassName = function (el, className) {
        var children = el.children,
            childrenByClass = [];
        for (var i = 0; i < el.children.length; i++) {
            if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
        }
        return childrenByClass;
    };

    /* 
        Animate height of an element
    */
    Util.setHeight = function (start, to, element, duration, cb) {
        var change = to - start,
            currentTime = null;

        var animateHeight = function (timestamp) {
            if (!currentTime) currentTime = timestamp;
            var progress = timestamp - currentTime;
            var val = parseInt((progress / duration) * change + start);
            // console.log(val);
            element.setAttribute("style", "height:" + val + "px;");
            if (progress < duration) {
                window.requestAnimationFrame(animateHeight);
            } else {
                cb();
            }
        };

        //set the height of the element before starting animation -> fix bug on Safari
        element.setAttribute("style", "height:" + start + "px;");
        window.requestAnimationFrame(animateHeight);
    };

    /* 
        Smooth Scroll
    */

    Util.scrollTo = function (final, duration, cb) {
        var start = window.scrollY || document.documentElement.scrollTop,
            currentTime = null;

        var animateScroll = function (timestamp) {
            if (!currentTime) currentTime = timestamp;
            var progress = timestamp - currentTime;
            if (progress > duration) progress = duration;
            var val = Math.easeInOutQuad(progress, start, final - start, duration);
            window.scrollTo(0, val);
            if (progress < duration) {
                window.requestAnimationFrame(animateScroll);
            } else {
                cb && cb();
            }
        };

        window.requestAnimationFrame(animateScroll);
    };

    /* 
      Focus utility classes
    */

    //Move focus to an element
    Util.moveFocus = function (element) {
        if (!element) element = document.getElementsByTagName("body")[0];
        element.focus();
        if (document.activeElement !== element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
        }
    };

    /* 
      Misc
    */

    Util.getIndexInArray = function (array, el) {
        return Array.prototype.indexOf.call(array, el);
    };

    Util.cssSupports = function (property, value) {
        if ('CSS' in window) {
            return CSS.supports(property, value);
        } else {
            var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            return jsProperty in document.body.style;
        }
    };

    /* 
        Polyfills
    */
    //Closest() method
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    //Custom Event() constructor
    if (typeof window.CustomEvent !== "function") {

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    }

    /* 
        Animation curves
    */
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };







    (function () {
        // Add to Cart Interaction - by CodyHouse.co
        var cart = document.getElementsByClassName('js-cd-cart');
        if (cart.length > 0) {
            var cartAddBtns = document.getElementsByClassName('js-cd-add-to-cart'),
                cartBody = cart[0].getElementsByClassName('cd-cart__body')[0],
                cartList = cartBody.getElementsByTagName('ul')[0],
                cartListItems = cartList.getElementsByClassName('cd-cart__product'),
                cartTotal = cart[0].getElementsByClassName('cd-cart__checkout')[0].getElementsByTagName('span')[0],
                cartCount = cart[0].getElementsByClassName('cd-cart__count')[0],
                cartCountItems = cartCount.getElementsByTagName('li'),
                cartUndo = cart[0].getElementsByClassName('cd-cart__undo')[0],
                productId = 0, //this is a placeholder -> use your real product ids instead
                cartTimeoutId = false,
                animatingQuantity = false;
            initCartEvents();


            function initCartEvents() {
                // add products to cart
                for (var i = 0; i < cartAddBtns.length; i++) {
                    (function (i) {
                        cartAddBtns[i].addEventListener('click', addToCart);
                    })(i);
                }

                // open/close cart
                cart[0].getElementsByClassName('cd-cart__trigger')[0].addEventListener('click', function (event) {
                    event.preventDefault();
                    toggleCart();

                });

                cart[0].addEventListener('click', function (event) {
                    if (event.target == cart[0]) { // close cart when clicking on bg layer
                        toggleCart(true);
                    } else if (event.target.closest('.cd-cart__delete-item')) { // remove product from cart
                        event.preventDefault();
                        removeProduct(event.target.closest('.cd-cart__product'));
                    }
                });

                // update product quantity inside cart
                cart[0].addEventListener('change', function (event) {
                    if (event.target.tagName.toLowerCase() == 'select') quickUpdateCart();
                });

                //reinsert product deleted from the cart
                cartUndo.addEventListener('click', function (event) {
                    if (event.target.tagName.toLowerCase() == 'a') {
                        event.preventDefault();
                        if (cartTimeoutId) clearInterval(cartTimeoutId);
                        // reinsert deleted product
                        var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted')[0];
                        Util.addClass(deletedProduct, 'cd-cart__product--undo');
                        deletedProduct.addEventListener('animationend', function cb() {
                            deletedProduct.removeEventListener('animationend', cb);
                            Util.removeClass(deletedProduct, 'cd-cart__product--deleted cd-cart__product--undo');
                            deletedProduct.removeAttribute('style');
                            quickUpdateCart();
                        });
                        Util.removeClass(cartUndo, 'cd-cart__undo--visible');
                    }
                });
            };

            function addToCart(event) {
                event.preventDefault();
                if (animatingQuantity) return;
                var cartIsEmpty = Util.hasClass(cart[0], 'cd-cart--empty');
                //update cart product list
                addProduct(this);
                //update number of items 
                updateCartCount(cartIsEmpty);
                //update total price
                updateCartTotal(this.getAttribute('data-price'), true);
                //show cart
                Util.removeClass(cart[0], 'cd-cart--empty');
                
                let bage = document.querySelector('.shopbage')
                if(cartIsEmpty < 0){
                    bage.style.display = "block";
                }else{
                    bage.style.display = "none";
                }
            };

            function toggleCart(bool) { // toggle cart visibility
                var cartIsOpen = (typeof bool === 'undefined') ? Util.hasClass(cart[0], 'cd-cart--open') : bool;

                if (cartIsOpen) {
                    Util.removeClass(cart[0], 'cd-cart--open');
                    UpPage.style.display = 'block';
                    //reset undo
                    if (cartTimeoutId) clearInterval(cartTimeoutId);
                    Util.removeClass(cartUndo, 'cd-cart__undo--visible');
                    removePreviousProduct(); // if a product was deleted, remove it definitively from the cart

                    setTimeout(function () {
                        cartBody.scrollTop = 0;
                        //check if cart empty to hide it
                        if (Number(cartCountItems[0].innerText) == 0) Util.addClass(cart[0], 'cd-cart--empty');
                    }, 500);
                } else {
                    Util.addClass(cart[0], 'cd-cart--open');
                    UpPage.style.display = 'none';
                }
            };

            function addProduct(target) {
                // this is just a product placeholder
                // you should insert an item with the selected product info
                // replace productId, productName, price and url with your real product info
                // you should also check if the product was already in the cart -> if it is, just update the quantity
                productId = productId + 1;
                productName = target.getAttribute('data-name'), (true);
                productPrice = target.getAttribute('data-price'), (true);
                productImage = target.getAttribute('data-image'), (true);
                var productAdded = '<li class="cd-cart__product"><div class="cd-cart__image"><a href="#0"><img src='+productImage+' alt="..."></a></div><div class="cd-cart__details"><h3 class="truncate"><a href="#0">'+productName+'</a></h3><span class="cd-cart__price">'+productPrice+' LE</span><div class="cd-cart__actions"><a href="#0" class="cd-cart__delete-item">Delete</a><div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="cd-cart__select"><select class="reset" id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select><svg class="icon" viewBox="0 0 12 12"><polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg></span></div></div></div></li>';
                cartList.insertAdjacentHTML('beforeend', productAdded, 'value');
            };

            function removeProduct(product) {
                if (cartTimeoutId) clearInterval(cartTimeoutId);
                removePreviousProduct(); // prduct previously deleted -> definitively remove it from the cart

                var topPosition = product.offsetTop,
                    productQuantity = Number(product.getElementsByTagName('select')[0].value),
                    productTotPrice = Number((product.getElementsByClassName('cd-cart__price')[0].innerText).replace('$', '')) * productQuantity;

                product.style.top = topPosition + 'px';
                Util.addClass(product, 'cd-cart__product--deleted');

                //update items count + total price
                updateCartTotal(productTotPrice, false);
                updateCartCount(true, -productQuantity);
                Util.addClass(cartUndo, 'cd-cart__undo--visible');

                //wait 8sec before completely remove the item
                cartTimeoutId = setTimeout(function () {
                    Util.removeClass(cartUndo, 'cd-cart__undo--visible');
                    removePreviousProduct();
                }, 8000);
            };

            function removePreviousProduct() { // definitively removed a product from the cart (undo not possible anymore)
                var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted');
                if (deletedProduct.length > 0) deletedProduct[0].remove();

            };

            function updateCartCount(emptyCart, quantity) {
                if (typeof quantity === 'undefined') {
                    var actual = Number(cartCountItems[0].innerText) + 1;
                    var next = actual + 1;

                    if (emptyCart) {
                        cartCountItems[0].innerText = actual;
                        cartCountItems[1].innerText = next;
                        animatingQuantity = false;
                    } else {
                        Util.addClass(cartCount, 'cd-cart__count--update');

                        setTimeout(function () {
                            cartCountItems[0].innerText = actual;
                        }, 150);

                        setTimeout(function () {
                            Util.removeClass(cartCount, 'cd-cart__count--update');
                        }, 200);

                        setTimeout(function () {
                            cartCountItems[1].innerText = next;
                            animatingQuantity = false;
                        }, 230);
                    }
                } else {
                    var actual = Number(cartCountItems[0].innerText) + quantity;
                    var next = actual + 1;

                    cartCountItems[0].innerText = actual;
                    cartCountItems[1].innerText = next;
                    animatingQuantity = false;
                }
            };

            function updateCartTotal(price, bool) {
                cartTotal.innerText = bool ? (Number(cartTotal.innerText) + Number(price)).toFixed(2) : (Number(cartTotal.innerText) - Number(price)).toFixed(2);
            };

            function quickUpdateCart() {
                var quantity = 0;
                var price = 0;

                for (var i = 0; i < cartListItems.length; i++) {
                    if (!Util.hasClass(cartListItems[i], 'cd-cart__product--deleted')) {
                        var singleQuantity = Number(cartListItems[i].getElementsByTagName('select')[0].value);
                        quantity = quantity + singleQuantity;
                        price = price + singleQuantity * Number((cartListItems[i].getElementsByClassName('cd-cart__price')[0].innerText).replace('$', ''));
                    }
                }

                cartTotal.innerText = price.toFixed(2);
                cartCountItems[0].innerText = quantity;
                cartCountItems[1].innerText = quantity + 1;
            };
        }
    })();








    // shopping Bag Contact

(function() {
  function validEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }
 
  function validateHuman(honeypot) {
    if (honeypot) {
      console.log("Robot Detected!");
      return true;
    } else {
      console.log("Welcome Human!");
    }
  }
  function getFormData(form) {
    var elements = form.elements;
 
    var fields = Object.keys(elements).filter(function(k) {
          return (elements[k].name !== "honeypot");
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
 
    var formData = {};
    fields.forEach(function(name){
      var element = elements[name];
      formData[name] = element.value;
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          product = target.getAttribute('data-name'), (true);
          var thepro = document.querySelector('.cd-cart__body');
          if (item.checked || item.selected) {
            data.push(item.value);
            data.push(item.thepro.product.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });
 
    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "akaSheet"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default
 
    console.log(formData);
    return formData;
  }
 
  function handleFormSubmit(event) {  
    event.preventDefault();           
    var form = event.target;
    var data = getFormData(form);         
    if( data.email && !validEmail(data.email) ) {   
      var invalidEmail = form.querySelector(".email-invalid");
      if (invalidEmail) {
        invalidEmail.style.display = "block";
        return false;
      }
    } else {
      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
          console.log(xhr.status, xhr.statusText);
          console.log(xhr.responseText);
          var formElements = form.querySelector(".form-elements")
          if (formElements) {
            formElements.style.display = "none"; // hide form
          }
          var thankYouMessage = document.querySelector(".message");
          if (thankYouMessage) {

            thankYouMessage.style.display = "block";

		const nameForm = document.querySelector("#nameForm").value;
        const h1 = document.getElementById("thanks");
        const follow = document.getElementById("follow")
		
        h1.textContent = 'Thank You  "' + nameForm + '" \n Follow Us For All New';
        thankYouMessage.appendChild(h1);

          }
          return;
      };


      var encoded = Object.keys(data).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    }


  }
  
  function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);
 
  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
 })();
 






function myFunction2(me) {
    txt = document.getElementById("myBtn").value;

    // skip duplicate
    if( txt.search( me.value ) == 1 ) {
        return;
    }
    

    if( txt == '' ) {
        document.getElementById("myBtn").value = me.value;

    } else {
        document.getElementById("myBtn").value += ' / ' + me.value;

    }
};
