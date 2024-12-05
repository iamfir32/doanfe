import {Form, Formik} from "formik";
import InputLabel from "../../../components/input/InputLabel";
import SelectInput from "../../../components/input/SelectInput";
import {Button, Modal} from "antd";
import TeamApi from "../../../service/teamApi";
import * as Yup from "yup";
import UserApi from "../../../service/UserApi";
import {useEffect, useState} from "react";

const CreateTeam = ({isOpenModalCreate,setIsOpenModalCreate,messageApi,fetchTeams})=>{
    const [rescuer,setRescuer] = useState([]);
    const [victim,setVictim] = useState([]);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Tên đội không được để trống"),
        color: Yup.string()
            .required("Màu đại diện không được để trống"),
        members: Yup.array()
            .min(1, "Phải chọn ít nhất một thành viên")
            .required("Vui lòng chọn thành viên")
    });

    const handleCreateTeam = async (data)=>{
        try{
            const res = await TeamApi.createTeams(data);
            fetchTeams().then();
            messageApi.open({
                type: 'success',
                content: 'Thêm đội cứu hộ thành công',
            });
        }catch (e) {
            console.log(e)
            messageApi.open({
                type: "error",
                content: 'Cõ lỗi xảy ra! Thử lại sau',
            });
        }finally {
        }
    }


    const fetchRescuer = async ()=>{
        try{
            const res = await UserApi.getRescuer();
            setRescuer(res);
        }
        catch (e) {
            console.log(e);
        }
    }
    const fetchVictim = async ()=>{
        try{
            const res = await UserApi.getVictim();
            setVictim(res);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchRescuer().then();
        fetchVictim().then();
    }, []);
    return <Modal
        title={"Thêm đội cứu hộ"}
        open={isOpenModalCreate}
        onCancel={() => { setIsOpenModalCreate(false) }}
        footer={null}
    >

        <Formik
            initialValues={{
                name: '',
                color: '#000000',
                members: []
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                handleCreateTeam(values).then();
                setIsOpenModalCreate(false);
                resetForm();
            }}
        >
            {formik => (
                <Form onSubmit={formik.handleSubmit} className='flex flex-col gap-[10px]'>
                    <InputLabel
                        label="Tên đội"
                        required={true}
                        name="name"
                        formik={formik}
                        inputProp={{
                            placeholder: 'Nhập tên đội'
                        }}
                    />
                    <InputLabel
                        label="Chọn màu đại diện trên bản đồ"
                        name="color"
                        required={true}
                        formik={formik}
                        inputProp={{
                            type: 'color',
                            placeholder: 'Chọn màu đại diện trên bản đồ'
                        }}
                    />
                    <SelectInput
                        label="Chọn thành viên"
                        name="members"
                        required={true}
                        formik={formik}
                        selectProp={{
                            options: rescuer.map(res => ({
                                label: res?.username,
                                value: res?.id
                            })),
                            mode: "multiple",
                            placeholder: "Chọn đội",
                            allowClear: true
                        }}
                    />
                    <SelectInput
                        label="Chọn nạn nhân cần giải cứu"
                        name="victims"
                        formik={formik}
                        selectProp={{
                            options: victim.map(res => ({
                                label: res?.username,
                                value: res?.id
                            })),
                            mode: "multiple",
                            placeholder: "Chọn nạn nhân cần giải cứu",
                            allowClear: true
                        }}
                    />
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => {
                            setIsOpenModalCreate(false)
                            formik.resetForm();
                        }}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Thêm</Button>
                    </div>
                </Form>
            )}
        </Formik>
    </Modal>
}

export default CreateTeam;