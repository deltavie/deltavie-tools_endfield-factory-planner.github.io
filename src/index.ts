import { Planner } from './endfield-factory-planner/Planner';
import './index.css';

const rootEl = document.querySelector('#root');

const planner: Planner = new Planner();
planner.BuildProductChain("HC Valley Battery", 6);

if (rootEl) {
  rootEl.innerHTML = `
  <div class="content">
    <h1>Endfield Factory Planner</h1>
    <p>Latest Game Patch: 1.1</p>
    <div class="search">
      <input type="search" id="product-search" name="product-search-bar" placeholder="Enter product name..."/>
      <input type="number" id="product-quantity" name="quantity" min="0" max="999999" step="0.1" value="1" required />
      <span>/min</span>
      <button id="product-search-button">Search</button>
    </div>
    <div class="canvas">
          <canvas id="output-canvas" width="4000px" height="3000px"></canvas>
    </div>   
  </div>
`;
  const searchBtn = rootEl.querySelector("#product-search-button");
  const searchBar = rootEl.querySelector("#product-search");
  const quantityBar = rootEl.querySelector("#product-quantity");

  if(searchBtn && searchBar && quantityBar){
    searchBtn.addEventListener("click", () => {
      //@ts-ignore
      planner.BuildProductChain(searchBar.value, Number(quantityBar.value))
    });
  }
}
