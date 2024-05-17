import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaPercentage, FaPercent } from "react-icons/fa";
import { type } from "@testing-library/user-event/dist/type";

const CreateP = () => {
	let addBtnStyl = "rpt-add-btn";
	let { state } = useLocation();
	let isEditing = false;
	if (state === null) {
		isEditing = false;
	} else {
		isEditing = state.isEditing;
		if (isEditing) {
			addBtnStyl = "rpt-edit-btn";
		}
	}

	const [name, setName] = useState("");
	const [discripe, setDiscripe] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [price, setPrice] = useState(0);
	const [seller, setSeller] = useState("مصطفى");
	const [hamsh, setHamsh] = useState(0);
	const [prType, setPrType] = useState("")
	// console.log(state);
	useEffect(() => {
		isEditing &&
			fetch(`http://localhost:8080/products/${state.id}`)
				.then((response) => response.json())
				.then((data) => {
					// setPrd(data);
					let name = data.name.replaceAll(data.seller, "").slice(0, -1);
					setName(name);
					setDiscripe(data.discripe);
					setQuantity(data.qun);
					setPrice(data.prise);
					setSeller(data.seller);
					setHamsh(data.hamsh);
					setPrType(data.type)
				})
				.catch((error) => console.error("Error fetching data:", error));
	}, []);

	const handleSub = (e) => {
		e.preventDefault();
		const product = {
			name: name + " " + seller,
			prise: price,
			qun: quantity,
			discripe: discripe,
			seller: seller,
			type: prType,
			hamsh: hamsh,
		};
		if (!isEditing) {
			fetch("http://localhost:8080/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(product),
			}).then(() => {
				console.log("added!");
				window.alert("تم اضافة المنتج !");
			});
		} else {
			fetch(`http://localhost:8080/products/${state.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(product),
			}).then(() => {
				console.log("EDITED!");
				window.alert("تم تعديل المنتج!");
			});
		}
	};

	return (
		<div className="creatRecept">
			<h2 className="title">اضافة منتج</h2>
			<hr />
			<form onSubmit={handleSub}>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div className="c-prd" style={{ display: "flex", flexWrap: "wrap" }}>
						<div className="form-input c-prd-name" style={{ marginLeft: "50px" }}>
							<label>اسم المنتج: </label>
							<input
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="form-input c-prd-name">
							<label>نوع المنتج: </label>
							<input
								type="text"
								required
								value={prType}
								onChange={(e) => setPrType(e.target.value)}
							/>
						</div>
					</div>
					<div className="form-input c-prd-disc">
						<label>الوصف: </label>
						<textarea
							rows={5}
							// cols={58}
							style={{ width: "70%", resize: "vertical" }}
							type="text"
							value={discripe}
							onChange={(e) => setDiscripe(e.target.value)}
						></textarea>
					</div>
					<div className="form-input c-prd-seller">
						<label>البائع: </label>
						<input
							type="text"
							value={seller}
							onChange={(e) => setSeller(e.target.value)}
						/>
					</div>
					<div className="form-input c-prd-hamsh">
						<label>هامش الربح: </label>
						<input
							style={{ display: "inline", marginLeft: "10px", width: "100px" }}
							type="number"
							value={hamsh}
							onChange={(e) => setHamsh(parseInt(e.target.value))}
						/>
						<FaPercent />
					</div>
					<div className="prod-list">
						<div className="form-input c-prd-price">
							<label>سعر الوحدة:</label>
							<input
								type="number"
								required
								value={price}
								onChange={(e) => setPrice(parseInt(e.target.value))}
							/>
						</div>
						<div className="form-input c-prd-q">
							<label>الكمية:</label>
							<input
								type="number"
								value={quantity}
								required
								onChange={(e) => setQuantity(parseInt(e.target.value))}
							/>
						</div>
					</div>
					<div className="c-prd" style={{ display: "flex" }}>
						<label id="tP">
							<span id="tPtext">سعر المخزون: </span>
							{price * quantity}
							<span>ج</span>
						</label>
						<button id={addBtnStyl}>
							{!isEditing ? (
								<FaPlus style={{ transform: "scale(1.5)" }} />
							) : (
								<FaEdit style={{ transform: "scale(1.5)" }} />
							)}
						</button>{" "}
					</div>
				</div>
			</form >
		</div >
	);
};

export default CreateP;
