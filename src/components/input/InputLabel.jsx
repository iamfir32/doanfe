import {Input} from "antd";

const SelectInput=({label, inputProp})=>{
    return <div>
        {label && <p>{label}</p>}
        <Input {...inputProp} className='w-full' ></Input>
    </div>
}

export default SelectInput;