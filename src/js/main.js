var toggle = document.querySelector('#toggle')
var menu = document.querySelector('#menu')
var menuItems = document.querySelectorAll('#menu li a')

toggle.addEventListener('click', function () {
	if (menu.classList.contains('is-active')) {
		this.setAttribute('aria-expanded', 'false')
		this.classList.remove('active')
		menu.classList.remove('is-active')
	} else {
		menu.classList.add('is-active')
		this.setAttribute('aria-expanded', 'true')
		this.classList.add('active')
		//menuItems[0].focus();
	}
})
