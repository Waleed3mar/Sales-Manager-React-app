export const ImportantCalcs = () => {
	return;
};

export const handleNumbers = (number) => {
	const result = Number.isInteger(number)
		? number
		: number.toFixed(2);

	return result.toLocaleString()
};

export const calcTotalHamshPerSeller = (recepts, seller) => {

	let p = 0
	recepts &&
		recepts.map((rcp) => {
			Object.keys(rcp.products).filter((key) => key.includes(seller)).map((key) => {
				p += rcp.products[key] * rcp.productsPrice[key] * (rcp.ProductsHamsh[key] / 100);
			});

		});
	// console.log(p)
	return handleNumbers(p).toLocaleString();
};
export const calcTotalPrice = (recepts, seller) => {

	let p = 0
	recepts &&
		recepts.map((rcp) => {
			Object.keys(rcp.products).filter((key) => key.includes(seller)).map((key) => {
				p += rcp.products[key] * rcp.productsPrice[key];
			});

		});
	return handleNumbers(p).toLocaleString();
};

export const removeSeller = (fullName) => {
	let prdNameList = fullName.split(" ");
	prdNameList.pop();

	let prodName = prdNameList.join(" ");

	return prodName;
};

export const removeProdName = (fullName) => {
	let prdNameList = fullName.split(" ");
	let lastWord = prdNameList.pop();

	return lastWord;
};

export const prdPerSeller = (recepts, seller) => {

	let pO = {
		id: 0,
		name: "",
		itemP: 0,
		totalP: 0
	}
	let p = []
	recepts &&
		recepts.map((rcp) => {
			Object.keys(rcp.products).filter((key) => key.includes(seller)).map((key, index) => {
				p.push(`${removeSeller(key)}   (${rcp.products[key]}) * (${rcp.productsPrice[key]}) = (${rcp.products[key] * rcp.productsPrice[key]})\n`)

			});

		});
	// console.log(p)

	return p.sort();
};

export const calcWastMoney = (recepts, seller) => {
	let sum = 0;

	recepts.filter(rcp => rcp.pForSearch.includes(seller)).map(rcp => {
		sum += rcp.wastMony;
	})
	return sum;
};
