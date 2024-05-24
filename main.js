let dataBase = [];

// //fetching products
function fetchProducts() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => displayProducts(data.products))
    .catch((Error) => console.log(Error));
}

//fucntion to itrearte over the each data recieved from the API
function displayProducts(products) {
  //console.log(products);
  dataBase = products;
  console.log(dataBase);
  const productHtml = dataBase.map((data) => insertProduct(data)).join("");
  // console.log(productHtml);
  const productDiv = document.getElementById("products");
  productDiv.innerHTML = productHtml;
}

function insertProduct(product) {
  if (!product) return "";
  //console.log(product);
  //   console.log(product.brand);
  return `
    <div id="product" class="product">
      <div id="productImg" class="productImg">
        <img src="${product.thumbnail}" alt="image not found">
      </div>
      <div id="productInfo" class="productInfo">
        <h3>Category: ${product.category} <span id="pId">(PID:${product.id})</span></h3>
        <h3>Brand: ${product.brand}</h3>
        <h4>Model: ${product.title}</h4>
        <h4 class="des">${product.description}</h4>
        <h4><span id="rating">${product.rating} &#9734;</span><span id="stockLeft"> (${product.stock} Left)</span></h4>
        <h4>Price: ${product.price}$</h4>
        <h4 class="discount">${product.discountPercentage}% off</h4>
      </div>
      <div id="buttons" class="buttons">
        <button class="editBtn btn" onclick="displayEditModel(${product.id})">EDIT</button>
        <button class="deleteBtn btn" onclick="deleteProduct(${product.id})" >DELETE</button>
      </div>
    </div>
    `;
}

// function to fetch vaalue and dislay it into the editmodal
function displayEditModel(id) {
  console.log(id);
  document.getElementById("editModal").style.display = "block";
  document.getElementById("productDiv").classList.add("blur");

  dataBase.forEach((data) => {
    if (data.id === id) {
      //console.log("found");
      const updateEditModal = fetchEditInfo(data);
      document.getElementById("editModal").innerHTML = updateEditModal;
    }
  });
}

// function to fecth edit info
function fetchEditInfo(data) {
  console.log(data);
  return `
    <div id="product" class="editproduct">
        <div id="productImg" class="productImg">
            <img src="${data.thumbnail}" alt="image not found">
        </div>
        <div id="productInfo" class="productInfo">
            <h3>Category: ${data.category} <span id="pId">(PID:${data.id})</span></h3>
            <h3>Brand: ${data.brand}</h3>
            <label for="pModel">Model: </label>
            <input class="eInput" id="pModel" type="text" value="${data.title}"> <br>
            <label for="pDescrip">Description: </label>
            <input class="eInput" id="pDescrip" type="text" value="${data.description}"><br>
            <label for="pPrice">Price: </label>
            <input class="eInput" id="pPrice" type="number" value="${data.price}">
            <h4><span id="rating">${data.rating}&#9734;</span><span id="stockLeft"> (${data.stock} Left)</span></h4>
        </div>
        <div id="buttons" class="buttons">
            <button class="deleteBtn btn" onclick="closeEditModal()">CANCEL</button>
            <button class="editBtn btn" onclick="updateData(${data.id})">UPDATE</button>
        </div>
    </div>    
    `;
}

//function to close the edit modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("productDiv").classList.remove("blur");
}

// function to updateDiv
function updateData(id) {
  console.log(id);
  const productIndex = dataBase.findIndex((data) => data.id === id);
  console.log(productIndex);
  if (productIndex !== -1) {
    let tit = document.getElementById("pModel").value;
    let des = document.getElementById("pDescrip").value;
    let pri = document.getElementById("pPrice").value;
    console.log(tit);
    console.log(des);
    console.log(pri);

    fetch(`https://dummyjson.com/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: tit,
        description: des,
        price: pri,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        if (data.message === `Product with id '${id}' not found`) {
          dataBase[productIndex].title = tit;
          dataBase[productIndex].description = des;
          dataBase[productIndex].price = pri;
        } else {
          // Update the product in dataBase
          dataBase[productIndex] = data;
        }
        displayProducts(dataBase);
        closeEditModal();
      })
      .catch((error) => console.log(error));
  }
}

// delete product

function deleteProduct(id) {
  console.log(id);
  console.log(dataBase[0]);
  alert(`Deleting Product with ID: ${id}`);
  fetch(`https://dummyjson.com/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.isDeleted);
      if (data.isDeleted || dataBase.filter((data) => data.id !== id)) {
        dataBase = dataBase.filter((data) => data.id !== id);
        displayProducts(dataBase);
      }
    });
  //console.log(dataBase);
}

// adding products

function addData() {
  const imgUrl = document.getElementById("addImgUrl").value;
  const category = document.getElementById("addCategory").value;
  const pid = document.getElementById("addPID").value;
  const brand = document.getElementById("addBrand").value;
  const model = document.getElementById("addModel").value;
  const descrip = document.getElementById("addDescription").value;
  const price = document.getElementById("addPrice").value;
  const rating = document.getElementById("addRating").value;
  const stock = document.getElementById("addNoStock").value;
  const discount = document.getElementById("addDiscount").value;

  console.log(
    imgUrl,
    category,
    pid,
    brand,
    model,
    descrip,
    price,
    rating,
    stock
  );

  fetch("https://dummyjson.com/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: model,
      category: category,
      id: pid,
      brand: brand,
      description: descrip,
      price: price,
      rating: rating,
      stock: stock,
      thumbnail: imgUrl,
      discountPercentage: discount,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      dataBase.push(data);
      displayProducts(dataBase);
      closeAddEditModal();
    })
    .catch((error) => console.log(error));
}

function openEditModal() {
  document.getElementById("addModal").style.display = "block";
  document.getElementById("productDiv").classList.add("blur");
}

function closeAddEditModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("productDiv").classList.remove("blur");
}

fetchProducts();
