import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import logo from '../images/brand.png';
// import QR from '../images/QR.png';
import { useState, useEffect } from "react";
import { handleNumbers } from "./ImportantCalcs";
import {
	FaTrash,
	FaEdit,
	FaPrint,
	FaEquals,
	FaTimes,
	FaPercent,
	FaUndo,
} from "react-icons/fa";

const ReceptDetails = ({ isPrint }) => {
	const navigate = useNavigate();

	const { id } = useParams();
	const { error, isLoading } = useFetch("http://localhost:8080/recepts/" + id);
	const [recepts, setRecept] = useState();
	const [products, setProducts] = useState();
	const [settings, setSettings] = useState(" ")

	let totalPriceHamsh = 0;

	const handleDelete = () => {

		let confirm = window.confirm("هل انت متأكد ؟");

		if (confirm === true) {
			fetch("http://localhost:8080/recepts/" + recepts.id, {
				method: "DELETE",
			})
				.then(() => {
					// navigate("/");
				})
		} else return;
	};

	const removeSeller = (fullName) => {
		let prdNameList = fullName.split(" ");
		prdNameList.pop();

		let prodName = prdNameList.join(" ");

		return prodName;
	};
	const removeProdName = (fullName) => {
		let prdNameList = fullName.split(" ");
		let lastWord = prdNameList.pop();

		return lastWord;
	};
	const calcTotalHamsh = (quantity, PPI, hamsh) => {
		let totalHamsh = quantity * PPI * (hamsh / 100);
		const result = Number.isInteger(totalHamsh)
			? totalHamsh
			: totalHamsh.toFixed(2);

		totalPriceHamsh += totalHamsh;

		return result;
	};
	const changeReceptType = (rcpId) => {
		fetch(`http://localhost:8080/recepts/${rcpId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				retunFlag: true,
			}),
		})
	}

	const returnPrdQuantity = (returnQ, prdQun, prdId) => {
		const product = {
			qun: prdQun + returnQ,
		}

		fetch(`http://localhost:8080/products/${prdId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(product),
		})


	}
	const handleReturn = () => {
		let confirm = window.confirm("هل انت متأكد ؟");
		let a = recepts.products
		console.log(Object.keys(a).length)
		if (confirm === true) {
			if (Object.keys(a).length == 0) {

				changeReceptType(recepts.id)
			} else {

				Object.keys(recepts.products).map((key) => (
					products.filter(prd => prd.name === key).map(
						(prd) => (returnPrdQuantity(recepts.products[key], prd.qun, prd.id))
					)
				))
				changeReceptType(recepts.id)
			}

			// recepts && products && handleDelete(confirm);

		} else return
	}

	useEffect(() => {
		fetch("http://localhost:8080/settings/1")
			.then((response) => response.json())
			.then((data) => {
				setSettings(data);
			})
		fetch("http://localhost:8080/recepts/" + id)
			.then((response) => response.json())
			.then((data) => {
				setRecept(data);
				// console.log(data)
			})
			.catch((error) => console.error("Error fetching data:", error));
		fetch(`http://localhost:8080/products`)
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
			})
	}, []);

	return (
		<div className="recept-detail-container print-detail-container">
			{isLoading && <div>جارٍ التحميل </div>}
			{error && <div>{error}</div>}
			{recepts && (
				<>
					<div className="recept-detail-header">
						{settings && <h1 style={{ display: "inline" }}>{settings.title}</h1>}
						<h3 style={{ display: "inline" }} className="title">
							كود الفاتورة | {recepts.id}
						</h3>
						<div className="logo">
							<div className="brand" style={isPrint ? {} : { display: "none" }}>
								<img className="brand-img" src={logo} height={300} alt="brand" />
							</div>

						</div>
					</div>
					<div
						id={isPrint ? "change2-for-print" : ""}
						className="recept recept-detail"
					>
						<div className="rep-detail-1stC">
							<div className="rep-detail-1stC-name">
								<h2 style={{ display: "inline" }}>
									اسم العميل:{" "}
								</h2>
								<h1 style={{ display: "inline" }}>{recepts.NOC}</h1>
							</div>
							<div className="rep-detail-1stC-address">
								<h2 style={{ display: "inline" }}>
									العنوان:{" "}
								</h2>
								<h1 style={{ display: "inline" }}>{recepts.address}</h1>
							</div>
						</div>
						<div className="rep-detail-phone">
							<h2 style={{ display: "inline" }}>موبايل: </h2>
							<div style={{ display: "inline", marginRight: "16px" }}>
								<pre style={{ display: "inline" }}>{recepts.phone}</pre>
							</div>
						</div>
						<span id={isPrint ? "change4-for-print" : ""}>
							<span style={{ margin: "20px 10px" }}>
								المشتريات
							</span>
							<div
								id={isPrint ? "change3-for-print" : ""}
								className="list-label">
								<div className="prd-label prod-name">المنتج</div>
								<div
									style={isPrint ? { display: "none" } : {}}
									className="prd-label prod-name"
								>
									البائع
								</div>

								<div className="prd-label prd-bought">الكمية</div>

								<div className="recept-q prd-label"></div>

								<div className="prd-label prd-price">سعر الشراء</div>
								<div className="recept-q prd-label"> </div>
								<div className="prd-label tot-price">الاجمالي</div>
								<div
									style={isPrint ? { display: "none" } : {}}
									className="prd-label prod-name"
								>
									هامش الربح
								</div>
								<div
									style={isPrint ? { display: "none" } : {}}
									className="prd-label prod-name"
								>
									اجمالي الربح
								</div>
							</div>
							<hr />

							<div
								id={isPrint ? "recept-all-print" : ""}
								className="recept-all">
								{Object.keys(recepts.products).map((key) => (
									<div key={key}>
										<li className="recept-detail-row">
											{/*المنتج*/}
											<div className="rcept-name"> {removeSeller(key)}</div>
											{/*البائع*/}
											<div
												style={isPrint ? { display: "none" } : { padding: "3px 5px" }}
												className="rcept-name prod-seller prod-seller-RD"
											>
												{removeProdName(key)}
											</div>
											{/*الكمية*/}
											<div className="recept-q"> {recepts.products[key]}</div>

											<div className="recept-q">
												<FaTimes />
											</div>
											{/*سعر الشراء*/}
											<div className="recept-q">
												{recepts.productsPrice[key].toLocaleString()} {" "}ج
											</div>
											<div className="recept-q">
												<FaEquals />
											</div>
											{/*الاجمالي*/}
											<div style={{ color: "#795548", fontWeight: "bold" }} className="recept-q prd-total-price">
												{(
													recepts.productsPrice[key] * recepts.products[key]
												).toLocaleString()}{" "}
												ج
											</div>
											{/*هامش الربح*/}
											<div
												style={
													isPrint
														? { display: "none" }
														: {
															color: "#2196f3", borderRight: "2px dashed black"
														}
												}
												className="rcept-name"
											>
												<FaPercent style={{ fontSize: "13px" }} />
												<span>{recepts.ProductsHamsh[key]}</span>
											</div>
											{/*اجمالي الربح*/}
											<div
												style={isPrint ? { display: "none" } : { color: "#4caf50" }}
												className="rcept-name"
											>
												<span>
													{calcTotalHamsh(
														recepts.products[key],
														recepts.productsPrice[key],
														recepts.ProductsHamsh[key]
													)}
													ج
												</span>
											</div>
										</li>
										<hr />
									</div>
								))}
							</div>
						</span>
						<div className="summry">
							<div className="income total-price-row">
								<div id="mblgPrint" className="mblg">المبلغ:</div>
								<h1>
									{recepts.prise.toLocaleString()} ج
								</h1>
							</div>
							<div
								style={isPrint ? { display: "none" } : {}}
								className="special"
							>
								<div className="wast-mony total-price-row">
									<div className="mblg" > اجمالي الربح: </div>
									<h2>
										{handleNumbers(totalPriceHamsh)} ج
									</h2>
								</div>
								<div className="wast-mony total-price-row">
									<div className="mblg" > المصروفات: </div>
									<h2>
										{handleNumbers(recepts.wastMony)} ج
									</h2>
								</div>
								<div className="wast-mony total-price-row">
									<div className="mblg" > صافي الربح: </div>
									<h2>
										{handleNumbers(totalPriceHamsh - recepts.wastMony)} ج
									</h2>
								</div>
							</div>
						</div>
						<span>
							<span>
								<span style={{ color: "#646464" }}>تاريخ الاضافة:</span>
								<span style={{ display: "inline-block" }}>{recepts.date}</span>
							</span>
						</span>
						<div id={isPrint ? "hide-for-print" : ""} className="rcp-butns">
							<div className="rcp-btn-return">
								<button
									style={recepts.retunFlag ? { display: "none" } : {}}
									onClick={() => handleReturn()}
								>
									<FaUndo />
								</button>
							</div>
							<div className="rcp-btn-tools">
								<button id="rcp-delete-btn" onClick={() => handleDelete()}>
									<FaTrash />
								</button>

								<button id="rcp-edit-btn">
									<Link
										to="/createR"
										state={{
											id: recepts.id,
											isEditing: true,
											NOC: recepts.NOC,
											phone: recepts.phone,
											address: recepts.address,
											products: recepts.products,
											prise: recepts.prise,
										}}
									>
										<FaEdit />
									</Link>
								</button>
								<button>
									<Link to={`/PrintPage/${recepts.id}`} target="_blank">
										<FaPrint style={{ color: "lightseagreen" }} />
									</Link>
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ReceptDetails;
