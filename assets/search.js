class Search {
  constructor() {
    this.start();
    this.searchResults = document.getElementById("results");
    this.form = document.querySelector("form");
    this.input = document.getElementById("search-query");
    this.bindEvents();
  }

  async start() {
    this.data = await this.fetchData();
    this.initIndex(this.data);
  }

  initIndex(data) {
    this.index = lunr(function () {
      this.ref("ref");
      this.field("title");
      this.field("content");
      // this.metadataWhitelist = ["position"];
      Object.entries(data).forEach(([ref, item]) =>
        this.add({ ref: ref, ...item })
      );
    });
  }

  searchIndex(query) {
    return this.index.search(query);
  }

  async fetchData() {
    const response = await fetch("search.json");
    if (response.status !== 200) console.error(response.status);
    const data = await response.json();
    return data;
  }

  renderResult({ title, content }) {
    return `<li><h6>${title}</h6>${content}</li>`;
  }

  handleOnInput(event) {
    console.log(event);
    const q = event.target.value;
    this.run(q);
  }

  handleSubmit(event) {
    console.log(event);
    event.preventDefault();
    var data = new FormData(event.target);
    var q = data.get("q");
    this.run(q);
    // var searchParams = new URLSearchParams(window.location.search);
    // searchParams.set("q", q);
    // // window.location.search = searchParams.toString();
    // // history.pushState(null, '', newRelativePathQuery);
  }

  run(q) {
    const results = this.searchIndex(q);
    this.clearResults();
    results.forEach(({ ref, matchData: { metadata } }) => {
      const item = this.data[ref];
      this.searchResults.innerHTML += this.renderResult(item);
      const mark = new Mark(this.searchResults.lastChild);
      Object.entries(metadata).forEach(([term, fields]) => {
        mark.mark(term);
        Object.keys(fields).forEach((field) => {});
      });
    });
  }

  clearResults() {
    let child;
    while ((child = this.searchResults.lastChild)) {
      this.searchResults.removeChild(child);
    }
  }

  bindEvents() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this), false);
    this.input.addEventListener(
      "keydown keyup",
      this.handleOnInput.bind(this),
      false
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.search = new Search();
  window.search.start();
});
