import useFetch from "../Hooks/useFetch";
import RightSideBar from "./RightSideBar";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { removeSeller } from "./ImportantCalcs.js"

const Products = () => {
	const { data: products } = useFetch("http://localhost:8080/products");
	const [previewProducts, setPreviewProducts] = useState();

	const [selectedType, setSelectedType] = useState(null);
	const [selectedProducts, setSelectedProducts] = useState();
	const handleTypeButtonClick = (type) => {
		setSelectedType(type);
	};
	const handleSellerButtonClick = (type) => {
		if (type === "All") {
			products && setPreviewProducts(products);
			// console.log(type);
		} else {
			products &&
				setPreviewProducts(
					products.filter((product) => {
						return product.seller.includes(type);
					})
				);
		}
		console.log(selectedProducts);
	};
	let x = 0;
	const navigate = useNavigate();

	const calcTotal = () => {
		products && products.map((prd) => (x += prd.prise * prd.qun));
		return x;
	};
	useEffect(() => {
		products && setPreviewProducts(products);
		products && setSelectedProducts(products);
	}, [products]);

	// const deleteConferm = (prdId) => {
	// 	let confirm = window.confirm("هل انت متأكد ؟");
	// 	if (confirm === true) {
	// 		handleDelete(prdId);
	// 	} else return;
	// };

	const handleDelete = (x) => {
		let confirm = window.confirm("هل انت متأكد ؟");

		if (confirm === true) {
			fetch("http://localhost:8080/products/" + x, {
				method: "DELETE",
			})
				.then(window.location.reload())
				.then(() => {
					window.alert("تم حذف المنتج");
				});
		} else return;
	};

	return (
		<div className="prd-main">
			<h1 className="title">قائمة المنتجات</h1>
			<div className="info-line">
				<div className="add-prd">
					<div className="details">
						<span>اجمالي سعر المخزن | </span>
						<div className="total-prd-price">
							{calcTotal().toLocaleString()} ج
						</div>
					</div>
					<div className="addP">
						<Link
							to="/createP"
							state={{
								isEditing: false,
							}}
						>
							{" "}
							+ اضافة منتج
						</Link>
					</div>
				</div>
				<hr />
			</div>
			<div className="prd-main-container">
				<div className="sideBar">
					<div className="sideBar-container">
						{previewProducts && (
							<RightSideBar
								products={previewProducts}
								onTypeButtonClick={handleTypeButtonClick}
								selector={"type"}
							/>
						)}
						{previewProducts && (
							<RightSideBar
								products={previewProducts}
								onTypeButtonClick={handleSellerButtonClick}
								selector={"seller"}
							/>
						)}
					</div>
				</div>

				<div className="receptContainer prd-container">
					{previewProducts &&
						previewProducts
							.filter((product) => {
								if (selectedType == null) {
									return product;
								} else {
									console.log(selectedType);
									return product.type.includes(selectedType);
								}
							})
							.map((prd) => (
								<div key={prd.id} className="products">
									<div className="prd-header">
										<div className="prd-detail prd-code">
											<div className="prf-label"> </div>
											<div>{prd.id}</div>
										</div>
										<h2 className="prd-detail prd-name">
											{removeSeller(prd.name)}
										</h2>
									</div>
									<div className="single-prd-info-container">

										<div style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											position: "relative",
											marginTop: "15px"
										}}>
											<div className="prd-detail prd-seller-main">
												<div>{prd.seller}</div>
											</div>
											<div className="prd-detail prd-dcr">
												<div className="prf-label">الوصف: </div>
												<p>{prd.discripe}</p>
											</div>

											<div className="prd-detail prd-prise">
												<span className="prf-label">سعر الوحدة: </span>
												<span>{prd.prise.toLocaleString()}</span>ج
											</div>
											<div className="prd-detail prd-q">
												<span className="prf-label">المخزون: </span>
												<span>{prd.qun}</span>
											</div>
											<div className="prd-detail prd-total-prise">
												<span className="prf-label">اجمالي : </span>
												<span style={{ fontWeight: "bold", color: "#333" }}>
													{(prd.qun * prd.prise).toLocaleString()} ج
												</span>
											</div>
										</div>


									</div>
									<div className="prd-butns">
										<button
											id="rcp-delete-btn"
											onClick={() => handleDelete(prd.id)}
										>
											<FaTrash />
										</button>
										<Link
											to="/createP"
											state={{
												id: prd.id,
												isEditing: true,
												name: prd.name,
												discripe: prd.discripe,
												quantity: prd.qun,
												price: prd.prise,
											}}
										>
											<button id="rcp-edit-btn">
												<FaEdit />
											</button>
										</Link>
									</div>

								</div>
							))}
				</div>
			</div>
		</div>
	);
};

export default Products;
