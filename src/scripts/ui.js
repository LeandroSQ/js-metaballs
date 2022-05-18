class UIController {

	constructor() {
		this.onOptionSelectedEventListener = null;

		this.wrapper = document.getElementById("wrapper");
		this.footer = document.getElementsByTagName("footer")[0];
		this.fpsCounter = document.getElementById("fps-counter");

		this.#setup();
	}

	#setup() {
		this.options = this.footer.querySelector("ul.options");
		for (const child of [...this.options.children]) {
			// Attach a on-click listener to the option
			child.addEventListener("click", this.#onOptionClick.bind(this));

			// Attach a on-click listener to the sub-options
			const subOptions = document.getElementById(child.getAttribute("data-sub-options"));
			subOptions.addEventListener("click", this.#onSubOptionsSelected.bind(this));
		}
	}

	#onOptionClick(event) {
		event.preventDefault();

		// Already selected, ignore it
		if (event.target.classList.contains("selected")) return;

		this.deselectAllOptions();

		// Mark the clicked option as selected
		event.target.classList.add("selected");

		// Show the sub options
		this.#setSubOptionsVisibility(event.target.getAttribute("data-sub-options"), true);

		// Extract the data-sub-options attribute
		const selectedOption = event.target.getAttribute("data-sub-options").replace("-options", "");

		// Extract the data-asset attribute
		const selectedSubOption = this.footer.querySelector("ul.sub-options.active li.selected").getAttribute("data-asset");

		// Check for the custom event listener
		if (this.onOptionSelectedEventListener) {
			this.onOptionSelectedEventListener(selectedOption, selectedSubOption);
		}
	}

	#setSubOptionsVisibility(id, isVisible) {
		const subOptions = document.getElementById(id);
		if (!subOptions) return;

		// Mark the sub options to be visible or not
		if (isVisible) subOptions.classList.add("active");
		else subOptions.classList.remove("active");
	}

	#onSubOptionsSelected(event) {
		event.preventDefault();

		this.deselectAllSubOptions();

		// Mark the clicked option as selected
		event.target.classList.add("selected");

		// Extract the data-asset attribute
		const selectedSubOption = event.target.getAttribute("data-asset");

		// Extract the option data-sub-options attribute
		const selectedOption = this.options.querySelector("li.selected").getAttribute("data-sub-options").replace("-options", "");

		// Check for the custom event listener
		if (this.onOptionSelectedEventListener) {
			this.onOptionSelectedEventListener(selectedOption, selectedSubOption);
		}
	}

	deselectAllOptions() {
		// Deselect all other options
		const selected = this.options.querySelector(".selected");
		if (selected) {
			// Deselect the previous option
			selected.classList.remove("selected");

			// Hide the sub options
			this.#setSubOptionsVisibility(selected.getAttribute("data-sub-options"), false);
		}
	}

	deselectAllSubOptions() {
		// Deselect all other options
		const selected = this.footer.querySelector("ul.sub-options.active li.selected");
		if (selected) selected.classList.remove("selected");
	}

	setSelectedOption(option, subOption) {
		this.deselectAllOptions();

		const optionElement = this.options.querySelector(`li[data-sub-options="${option}-options"]`);
		if (optionElement) {
			optionElement.classList.add("selected");

			// Show the sub options
			this.#setSubOptionsVisibility(optionElement.getAttribute("data-sub-options"), true);

			this.deselectAllSubOptions();

			// Select the sub option
			const subOptionElement = this.footer.querySelector(`ul.sub-options.active li[data-asset="${subOption}"]`);
			if (subOptionElement) subOptionElement.classList.add("selected");
		}
	}

	addEventListener(callback) {
		this.onOptionSelectedEventListener = callback;
	}

	setFPS(fps) {
		this.fpsCounter.innerText = `FPS: ${fps}`;
	}

	get wrapperSize() {
		return {
			width: this.wrapper.offsetWidth,
			height: this.wrapper.clientHeight
		};
	}

	get footerSize() {
		return {
			width: this.footer.offsetWidth,
			height: this.footer.offsetHeight
		};
	}

}

const instance = new UIController();
export default instance;