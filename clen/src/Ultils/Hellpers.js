import icons from "./Icons"
const {AiFillStar,AiOutlineStar} = icons
export const creactSlug = string =>{
    string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split().join('-')
} 
export const formatMoney = number => {
    const adjustedNumber = number / 100;
    return Number(adjustedNumber.toFixed(2)).toLocaleString();
};
export const renderStarFromNumber = (number) =>{
    // if(!Number(number)) return
const stars = []

    for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange"/>)
    for (let i = 5; i > +number; i--) stars.push(<AiOutlineStar color="orange"/>)
    return stars
}

export const generateRange = (start,end) => {
const length = end + 1 - start
return Array.from({length},(_, index)=> start+index)
}
export const validate = (payload, setInvalidFields)=>{
    let invalids = 0 
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload){
        if (typeof arr[1] === 'string' && arr[1].trim() === "" ) {
            invalids++ 
            setInvalidFields(prev => [...prev,{name: arr[0], mes:"Không được để trống"}])
        }
    }
    for(let arr of formatPayload){
        switch(arr[0]){
            case 'email':
                const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!arr[1].match(regexEmail)){
                    invalids++
                    setInvalidFields(prev => [...prev,{name:arr[0],mes:'email invalid'}])
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
 export function secondsToHms(d){
    d = Number(d) /1000
    const h = Math.floor(d/ 3600)
     const m = Math.floor(d % 3600 / 60)
     const s = Math.floor(d % 3600 % 60)
return ({h,m,s})
 }
export const getBase64 = (file) =>{
    if(!file) return ''
    return new Promise((resolve,reject) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error)
    })
}