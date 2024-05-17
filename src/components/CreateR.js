import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeSeller } from "./ImportantCalcs";
import {
	FaPlus,
	FaEdit,
	FaExclamation,
	FaUser,
	FaPhone,
	FaMapMarker,
	FaCalendar,
	FaDollarSign,
} from "react-icons/fa";

const CreatR = () => {
	//states
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [addrs, setAddrs] = useState("");
	const [wastMony, setWastMony] = useState(0);
	const [price, setPrice] = useState(0);


	const [edProducts, setEdProducts] = useState({});
	const [prodNames, setprodNames] = useState([]);
	const [prodPrise, setProdPrise] = useState([]);
	const [prodHamsh, setProdHamsh] = useState([]);

	// const [newProdPrise, setNewProdPrise] = useState([]);
	// const [newProdHamsh, setNewProdHamsh] = useState([]);

	const date = new Date();
	const kh = `${date.toISOString().slice(0, 10)}`;
	const [dateTime, setDateTime] = useState(kh);

	const [products, setProducts] = useState([]);
	const [forSearch, setForSearch] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState({});

	let addBtnStyl = "rpt-add-btn";
	let { state } = useLocation();
	// const [isEditing, setIsEditing] = useState(false);
	let isEditing = false;
	if (state === null) {
		isEditing = false;
	} else {
		isEditing = state.isEditing;
		if (isEditing) {
			addBtnStyl = "rpt-edit-btn";
		}
	}

	//variabls & keys
	let b = {};
	let prodIds = [];
	let pForSearch = "";

	useEffect(() => {
		fetch("http://localhost:8080/products")
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				// تحديث حالة المنتجات المحددة مع الكميات الافتراضية
				const defaultSelectedProducts = data.reduce((obj, product) => {
					obj[product.id] = 0;
					return obj;
				}, {});
				setSelectedProducts(defaultSelectedProducts);
			})
			.catch((error) => console.error("Error fetching data:", error));

		if (isEditing) {
			fetch(`http://localhost:8080/recepts/${state.id}`)
				.then((response) => response.json())
				.then((data) => {
					setName(data.NOC);
					setPhone(data.phone.toLocaleString());
					setAddrs(data.address);
					setWastMony(data.wastMony);
					setEdProducts(data.products);
					setForSearch(data.pForSearch);
					setProdPrise(data.productsPrice);
					setProdHamsh(data.ProductsHamsh);
					setDateTime(data.date)

					setPrice(data.prise);
				});
		} else {
		}

	}, []);

	const handleQuantityChange = (productId, quantity, name, price, hamsh) => {
		// تحديث حالة المنتجات المحددة عند تغيير الكمية
		setSelectedProducts((prevState) => ({
			...prevState,
			[productId]: parseInt(quantity, 10) || 0,
		}));
		setprodNames((prevState) => ({
			...prevState,
			[name]: parseInt(quantity, 10) || 0,
		}));
		setProdPrise((prevState) => ({
			...prevState,
			[name]: price || 0,
		}));
		setProdHamsh((prevState) => ({
			...prevState,
			[name]: hamsh || 0,
		}));
	};

	// const handleTime = (e) => {
	// 	let finDate ="";
	// 	let date = new Date();
	// 	finDate = `{date}`
	// 	console.log(e);
	// };

	const calculateTotalprise = (x = 0) => {
		// حساب السعر الإجمالي للمنتجات المحددة
		return products.reduce((total, product) => {
			const quantity = selectedProducts[product.id] || 0;
			return total + product.prise * quantity;
		}, x);
	};
	function mergeProducts(...objects) {
		let mergedProducts = {};
		let mergedObject = {};
		for (const obj of objects) {
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					mergedObject[key] = (mergedObject[key] || 0) + obj[key];
				}
			}
		}

		Object.entries(mergedObject)
			.filter(([, value]) => value !== 0)
			.forEach(([key, value]) => (mergedProducts[key] = value));
		return mergedProducts;
	}

	const handleSub = (e) => {
		e.preventDefault();

		Object.entries(prodNames)
			.filter(([, value]) => value !== 0)
			.forEach(([key, value]) => (b[key] = value));

		Object.keys(selectedProducts).map((key) => prodIds.push(key));

		const recept = {
			retunFlag: false,
			NOC: name,
			phone: phone,
			address: addrs,
			wastMony: wastMony,
			products: b,
			pForSearch: pForSearch,
			productsPrice: prodPrise,
			ProductsHamsh: prodHamsh,
			date: dateTime.toLocaleString(),
			prise: calculateTotalprise(),
		};
		if (!isEditing) {
			Object.keys(b).map((key) => pForSearch = (`${pForSearch}` + `${key}`).replaceAll(" ", ""));
			fetch("http://localhost:8080/recepts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(recept),
			}).then(() => {
				for (let i = 0; i <= prodIds.length - 1; i++) {
					// newPrdQ = products[prodIds[i]].qun;
					let oldQ = products.filter((prd) => prd.id === parseInt(prodIds[i]));
					let slQ = selectedProducts[prodIds[i]];
					let newPrdQ = parseInt(oldQ[0].qun) - parseInt(slQ);

					fetch(`http://localhost:8080/products/${prodIds[i]}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							qun: newPrdQ,
						}),
					});

				}
				window.alert("تم اضافة الفاتورة");
				navigate("/");
			});
		} else {

			let newProduct = mergeProducts(b, edProducts);
			Object.keys(newProduct).map((key) => pForSearch = (`${pForSearch}` + `${key}`).replaceAll(" ", ""));

			let newProdHamsh

			fetch(`http://localhost:8080/recepts/${state.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					NOC: name,
					phone: phone,
					address: addrs,
					wastMony: wastMony,
					products: newProduct,
					pForSearch: pForSearch,
					productsPrice: prodPrise,
					ProductsHamsh: prodHamsh,
					date: dateTime,
					prise: calculateTotalprise(price),
				}),
			}).then(() => {
				for (let i = 0; i <= prodIds.length - 1; i++) {
					// newPrdQ = products[prodIds[i]].qun;
					let oldQ = products.filter((prd) => prd.id === parseInt(prodIds[i]));
					let slQ = selectedProducts[prodIds[i]];
					let newPrdQ = parseInt(oldQ[0].qun) - parseInt(slQ);

					fetch(`http://localhost:8080/products/${prodIds[i]}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							qun: newPrdQ,
						}),
					});

					/*
				مراقبة عملية التعديل على كمية المخزون الخاص بالمنتج
				console.log("start------------------------------------- ");
				console.log("prodIds[i]: " + prodIds[i]);
				// console.log(oldQ[0].qun);
				console.log("newPrdQ: --- " + newPrdQ);
				console.log("End------------------------------------- ");
				*/
				}
				window.alert("تم تعديل الفاتورة");
				navigate("/");
			});
		}
	};

	return (
		<div className="creatRecept">
			<h2 className="title">اضافة فاتورة</h2>
			<hr />
			<div className="create-container">
				<form onSubmit={handleSub}>
					<div className="user-info-container">
						<div className="form-input usr-name">
							<label>
								{" "}
								<div className="icon-create">
									<FaUser />
								</div>{" "}
								اسم العميل:
							</label>
							<input
								placeholder="الاســم..."
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="form-input usr-add">
							<label>
								<div className="icon-create">
									<FaMapMarker />
								</div>{" "}
								العنوان:
							</label>
							<input
								placeholder="العنوان...."
								type="text"
								required
								value={addrs}
								onChange={(e) => setAddrs(e.target.value)}
							/>
						</div>
						<div className="form-input usr-add">
							<label>
								<div className="icon-create">
									<FaDollarSign />
								</div>{" "}
								مصروفات:
							</label>
							<input
								placeholder="ادخل اجمالي المصروفات"
								type="number"
								// required
								value={wastMony}
								onChange={(e) => setWastMony(parseInt(e.target.value))}
							/>
						</div>
						<div className="form-input usr-pho">
							<label>
								<div className="icon-create">
									<FaPhone />
								</div>{" "}
								الموبايل:
							</label>
							<textarea
								placeholder="(ضع كل رقم في سطر منفصل)"
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							></textarea>
						</div>
						<label>
							<div className="icon-create">
								<FaCalendar />
							</div>
							التاريخ:
						</label>
						<div className="form-input usr-date">
							<input
								id="chosDate"
								type="date"
								// required
								value={dateTime}
								onChange={(e) => setDateTime(e.target.value)}
							/>
						</div>
					</div>
					<div className="prod-list">
						<h2>قائمة المنتجات</h2>
						<ul className="prod-list-ul">
							<li className="c-r-prd-item c-r-prd-item-label">
								<div>
									<span className="prod-seller prod-seller-label">البائع</span>
									<span> </span>
								</div>
								<div className="prod-name prod-name-label ">
									<span >المنتج{" "}</span>
								</div>
								<div className="s3r-label" style={{ width: "150px" }}>
									<span> السعر</span>
									<span style={{ color: "#fff", fontWeight: "500" }}></span>
								</div>
								<div className="qunatity-of-prd qunatity-of-prd-label">
									<div className="selecter-q">العدد</div>

								</div>
								<div className="actual-q actual-q-label">
									مخزون
									<span style={{ color: "#eee", marginRight: "5px" }}></span>
								</div>
								<div className="actual-q"
									style={!isEditing ? { display: "none" } : {}}>
									<span>تم شراء:</span>
									<span style={{ color: "#eee", marginRight: "5px" }}></span>
								</div>
								<div className="actual-q exMark">

								</div>
							</li>
							<hr style={{ width: "90%" }} />
							{products.map((product) => (
								<>
									<li key={product.id} className="c-r-prd-item">
										<div className="prod-seller">
											<span >{product.seller}</span>
											<span> </span>
										</div>
										<div className="prod-name">
											<span >{removeSeller(product.name)} </span> {" "}
										</div>
										<div style={{ width: "150px" }}>

											<span style={{ color: "#fff", fontWeight: "500" }}>{product.prise} ج</span>
										</div>
										<div className="qunatity-of-prd">

											<input
												type="number"
												value={selectedProducts[product.id] || 0}
												onChange={(e) =>
													handleQuantityChange(
														product.id,
														e.target.value,
														product.name,
														product.prise,
														product.hamsh
													)
												}
											/>
										</div>
										<div className="actual-q">

											<span style={{ color: "#eee", marginRight: "5px" }}>{product.qun} {product.qun > 10 ? "قطعة" : "قطع"}</span>
										</div>
										<div className="actual-q"
											style={!isEditing ? { display: "none" } : {}}>
											<span>تم شراء:</span>
											<span style={{ color: "#eee", marginRight: "5px" }}>{edProducts[product.name]} {edProducts[product.name] > 10 ? "قطعة" : "قطع"}</span>
										</div>
										<div className="actual-q exMark">
											{(selectedProducts[product.id] < 0) |
												(selectedProducts[product.id] > product.qun) ? (
												<FaExclamation style={{ color: "red" }} />
											) : (
												" "
											)}
										</div>
									</li>

									<hr />
								</>
							))}
						</ul>
					</div>
					<button id={addBtnStyl}>
						{!isEditing ? (
							<FaPlus style={{ transform: "scale(1.5)" }} />
						) : (
							<FaEdit style={{ transform: "scale(1.5)" }} />
						)}
					</button>{" "}
					<label id="tP">
						<span id="tPtext">اجمالي السعر: </span>
						{calculateTotalprise(price).toLocaleString()}ج
					</label>
				</form>
				{/*(name || addrs) && (
					<>
						<br />
						<div className="prev">محاكاة للفاتورة</div>
						<div className="recept">
							<div>اسم العميل: {name}</div>
							<div>العنوان: {addrs}</div>
							<div>السعر: {calculateTotalprise()}ج</div>
						</div>
					</>
				)*/}
			</div>
		</div>
	);
};
export default CreatR;
