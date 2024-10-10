import path from "./Path"
import icons from "./Icons"
import { AiOutlineDashboard} from "react-icons/ai"
import { MdGroups } from "react-icons/md";
import { TbBrandProducthunt } from "react-icons/tb";
import { AiFillGift } from "react-icons/ai";

export const navigation = [{
    id: 1,
    value: `HOME ▾`,
    path: `/${path.HOME}`,

},
{
    id: 5,
    value: "PRODUCTS ▾",
    path: `/${path.PRODUCTS}`,

},
{
    id: 4,
    value: "FAQS ▾",
    path: `/${path.FAQs}`,

},
{
    id: 2,
    value: "BLOGS ▾",
    path: `/${path.BLOGS}`,

},
{
    id: 3,
    value: "OUR SERVICES",
    path: `/${path.OUR_SERVICES}`
},

]
const { MdLocalShipping, BsShieldShaded, BsReplyFill, FaTty } = icons

export const ProductExtraInfoItemTion = [
    {
        id: 1,
        title: "Guarantee",
        sub: "Quality Checked",
        icon: <BsShieldShaded size={24} />

    },
    {
        id: 2,
        title: "Free Shipping",
        sub: "Free On All Products",
        icon: <MdLocalShipping size={24} />

    }, {
        id: 3,
        title: "Special Gift Cards",
        sub: "Special Gift Cards",
        icon: <AiFillGift size={24} />

    }, {
        id: 4,
        title: "Free Return",
        sub: "Within 7 Days",
        icon: <BsReplyFill size={24} />

    }, {
        id: 5,
        title: "Consultancy",
        sub: "Lifetime 24/7/356",
        icon: <FaTty size={24} />

    }
]

export const colors = [
    "black",
    "brown",
    'gray',
    "white",
    "pink",
    'yellow',
    'orange',
    'purple',
    'green',
    'blue'
]
export const sorts = [
    {
        id: 1,
        value: '-soId',
        text: "Best selling"
    },
    {
        id: 2,
        value: '-title',
        text: "AIphabetically,A-Z"
    },
    {
        id: 3,
        value: '-title',
        text: "AIphabetically,Z-A"
    },
    {
        id: 4,
        value: '-price',
        text: "Price,high to low"
    },
    {
        id: 5,
        value: '-price',
        text: "Price,low to high"
    }
    ,
    {
        id: 6,
        value: '-createdAt',
        text: "Date,new to old"
    }
    ,
    {
        id: 7,
        value: '-createdAt',
        text: "Date,low to new"
    }
]

export const voteOptions = [
    {
        id: 1,
        text: "Terrible"
    },
    {
        id: 2,
        text: "Bad"
    },
    {
        id: 3,
        text: "Neutral"
    },
    {
        id: 4,
        text: "good"
    },
    {
        id: 5,
        text: "perfect"
    }
    
    
    
   
]
export const adminSidebar = [
    {
        id: 1,
        type: "Single",
        text: "Dashboard",
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard />
    },
    {
        id: 2,
        type: "Single",
        text: "Manage users",
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups />
    },
    {
        id: 3,
        type: "Parent",
        text: "Manage product",
        icon: <TbBrandProducthunt />,
        subMenu:[
            {
                text:'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
            },
            {
                text:'Manage products',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            }
        ]
    },
     {
        id: 4,
        type: "Single",
        text: "Manage orders",
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
         icon: <AiFillGift />
    },
    
]
export const roles = [
    {
        code:1945,
        value:'Admin'
    },
    {
        code: 1979,
        value: 'User'
    },
]
export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    },
]
export const memberSidebar = [
    {
        id: 1,
        type: "Single",
        text: "Personal",
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <AiOutlineDashboard size={24}/>
    },
    {
        id: 2,
        type: "Single",
        text: "My cart",
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <MdGroups size={24} />
    },
    {
        id: 3,
        type: "Single",
        text: "Buy histories",
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <AiFillGift size={24} />
    },
    {
        id: 4,
        type: "Single",
        text: "Wislist",
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <AiFillGift size={24} />
    },

]
export const statusOrders=[
    {
        label:"Cancalled",
        value:"Cancalled"
    },
    {
        label: "Succeed",
        value: "Succeed"
    },
    {
        label: "Order",
        value: "Order"
    },
    {
        label: "False", 
        value: "False"
    },
    {
        label: "Available",
        value: "Available"
    }, 
    {
        label: "Transport",
        value: "Transport" 
    }
]