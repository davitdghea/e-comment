import { MdStarHalf, MdStar, MdStarBorder } from "react-icons/md";
export const creactSlug = string => {
    string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split().join('-')
}
export const formatMoney = number => {
    const adjustedNumber = number / 100;
    return Number(adjustedNumber.toFixed(2)).toLocaleString();
};


export const renderStarFromNumber = (number) => {
    const stars = [];
    const integerPart = Math.floor(number); // Phần nguyên
    const decimalPart = number - integerPart; // Phần thập phân

    // Thêm các sao vàng
    for (let i = 0; i < integerPart; i++) {
        stars.push(<MdStar color="orange" key={i} />);
    }

    // Thêm 1 sao nửa vàng nửa đen nếu có phần thập phân
    if (decimalPart > 0) {
        stars.push(<MdStarHalf color="orange" key={integerPart} />);
    }

    // Thêm các sao đen còn lại
    for (let i = stars.length; i < 5; i++) {
        stars.push(<MdStarBorder color="orange" key={i} />);
    }

    return stars;
};

export const generateRange = (start, end) => {
    const length = end + 1 - start
    return Array.from({ length }, (_, index) => start + index)
}
export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (typeof arr[1] === 'string' && arr[1].trim() === "") {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], mes: "Không được để trống" }])
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!arr[1].match(regexEmail)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'email invalid' }])
                }
                break;
            case 'password':
                const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!arr[1].match(regexPas)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'pass phải có 1 hoa, 1 thường, 1 đặc biệt, 1 số, lớn hơn 8 ký tự' }])
                }
                break;
            default:
                break;
        }
    }
    return invalids
}
export function secondsToHms(d) {
    d = Number(d) / 1000
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)
    return ({ h, m, s })
}
export const getBase64 = (file) => {
    if (!file) return ''
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error)
    })
}
export const keywordMap = {
    "điện thoại": "smartphone",
    "máy tính": "laptop",
    "speaker": "loa",
    "tivi":"television",
    "máy in":"printer",
    "máy ảnh":"camera",
    "phụ kiện":"accessories"
    
};
const colorMap = {
    Black: "#000000",
    White: "#FFFFFF",
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Cyan: "#00FFFF",
    Magenta: "#FF00FF",
    Brown: "#A52A2A",
    Orange: "#FFA500",
    Pink: "#FFC0CB",
    Gray: "#808080",
    Indigo: "#4B0082", 
    Teal: "#008080",
    Olive: "#808000",
    Gold: "#FFD700",
    Silver: "#C0C0C0",
    Beige: "#F5F5DC",
    Ivory: "#FFFFF0",
    Coral: "#FF7F50",
    Maroon: "#800000",
    Navy: "#000080",
    Lime: "#00FF00",
    Turquoise: "#40E0D0",
    Violet: "#EE82EE",
    Khaki: "#F0E68C",
    Peach: "#FFE5B4",
    Mint: "#98FF98",
    Lavender: "#E6E6FA",
    Crimson: "#DC143C",
    Plum: "#DDA0DD",
};

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(h => h + h).join('');
    }
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function colorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
}

export function closestColor(hex) {
    const inputColor = hexToRgb(hex);
    let minDistance = Infinity;
    let closestColorName = '';

    for (const [colorName, hexValue] of Object.entries(colorMap)) {
        const targetColor = hexToRgb(hexValue);
        const distance = colorDistance(inputColor, targetColor);

        if (distance < minDistance) {
            minDistance = distance;
            closestColorName = colorName;
        }
    }

    return closestColorName;
}
