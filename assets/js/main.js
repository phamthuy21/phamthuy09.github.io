$(function () {
  $(".nav-item-home").click(function () {
    $(".nav-item-home").offset().top;
  });

  $(".nav-item-band").click(function () {
    $("html,body").animate({ scrollTop: $(".text-theband").offset().top }, 400);
  });

  $(".nav-item-tour").click(function () {
    $("html,body").animate({ scrollTop: $(".bg-black").offset().top }, 400);
  });

  $(".nav-item-contact").click(function () {
    $("html,body").animate({ scrollTop: $(".contact").offset().top }, 400);
  });
});



function Validator(options){
  function getParent(element, selector){
      while(element.parentElement){
          if(element.parentElement.matches(selector)){
              return element.parentElement;
          }
          element = element.parentElement;
      }
  }

  var selectorRules = {}

  // Hàm thực hiện valdate
  function validate(inputElement, rule){
      var errorMessage
      var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
      
      // Lấy ra các rule của selector
      var rules = selectorRules[rule.selector]   

      // Lặp qua từng rule và kiểm tra
      // Nếu có lỗi thì dừng kiểm tra
      for(var i=0; i < rules.length; ++i){
          
          errorMessage = rules[i](inputElement.value)
          if(errorMessage) break;
      }
      
      

      if(errorMessage){
          errorElement.innerText = errorMessage;
          getParent(inputElement,options.formGroupSelector).classList.add('invalid')
      }
      else{
          errorElement.innerText = '';
          getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
      }

      return !errorMessage;

  }


  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if(formElement){
      // Khi submit form
      formElement.onsubmit = function(e){
          e.preventDefault();

          var isFormValid = true;

          // Lặp qua từng rule và validate
          options.rules.forEach(function(rule){
              var inputElement = formElement.querySelector(rule.selector)
              var isValid = validate(inputElement,rule)
              if(!isValid){
                  isFormValid = false
              }
          });
          
          
          if(isFormValid){
              //  console.log('Không lỗi')
              if(typeof options.onSubmit === 'function'){
                  
                  var enableInputs = formElement.querySelectorAll('[name]:not([disable])')
                  
                  var formValues = Array.from(enableInputs).reduce(function(values, input){
                      values[input.name] = input.value
                      return values;
                  },{});

                  options.onSubmit(formValues);
              }
          }

      }

      // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input ,... )
      options.rules.forEach(function(rule) {

          // Lưu lại các rules cho mỗi input
          if(Array.isArray(selectorRules[rule.selector])){
              selectorRules[rule.selector].push(rule.test);
          }else{
              selectorRules[rule.selector] = [rule.test]
          }
          
          var inputElement = formElement.querySelector(rule.selector)
      
          if(inputElement){
              // Xử lý trường hợp blur khỏi input
              inputElement.onblur = function(){
                  validate(inputElement,rule)
              }

              // Xử lý mỗi khi người dùng nhập
              inputElement.oninput = function(){
                  var errorElement = getParent(inputElement,options.formGroupSelector).querySelector('.form-message')
                  errorElement.innerText = '';
                  getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
              }
          }
      });

  }

}




// Định nghĩa rules
// Nguyen tắc của các lỗi
// 1.Khi có lỗi => Trả ra message lỗi
// 2.Khi hợp lệ => Không trả ra gì cả
Validator.isRequired = function(selector, message){
  return {
      selector: selector,
      test: function(value) {
          return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
      }
  }
}

Validator.isEmail = function(selector){
  return {
      selector: selector,
      test: function(value) {
          var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          return regex.test(value) ? undefined : 'Trường này phải là Email'
      }
  }
}
