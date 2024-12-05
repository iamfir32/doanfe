import Header from "../components/layout/Header";
import {Button, Input, Modal, message, Table, Tag, Space, Popconfirm} from "antd";
import Section from "../components/layout/Section";
import TeamApi from "../service/teamApi";
import UserApi from "../service/UserApi";
import {useState,useEffect} from "react";
import SelectInput from "../components/input/SelectInput";
import InputLabel from "../components/input/InputLabel";
import * as Yup from "yup";
import { Formik, Form } from "formik";

const ManageTeam =()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const breadScumb =[
        {
            title: 'Trang chủ',
        },
        {
            title: 'Quản lý đội cứu hộ',
        },
    ]

    const actions = <>
        <Button type="primary" onClick={()=>{setIsOpenModalCreate(true)}}>Thêm mới</Button>
        <Button type="primary" danger>Xóa</Button>
    </>
    
    const [teams,setTeams] = useState([]);
    const [rescuer,setRescuer] = useState([]);
    const [victim,setVictim] = useState([]);
    const [selectedRow,setSelectedRow] = useState();

    const [isOpenModalCreate,setIsOpenModalCreate] = useState(false);
    const [isLoading,setIsLoading] = useState(false);

    const fetchTeams = async ()=>{
        try{
            const res = await TeamApi.getTeams();
            setTeams(res);
        }
        catch (e) {
            console.log(e);
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
        fetchTeams().then();
        fetchRescuer().then();
        fetchVictim().then();
    }, []);

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
            setIsLoading(true);
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
            setIsLoading(false)
        }
    }

    const columns = [
        {
            title: 'Tên đội',
            dataIndex: 'name',
            key: 'name',

        }, {
            title: 'Màu đại diện',
            dataIndex: 'color',
            key: 'color',
            render:(data)=>{
                return <div className='w-full h-[20px]' style={{backgroundColor:data}}></div>
            }
        },
        {
            title: 'Thành viên',
            key: 'rescuer',
            className: " w-1/4",
            dataIndex: 'rescuer',
            render: (data,index) => {
                return (
                    <>
                        {data.map((tag) => {
                            return (
                                <Tag color={"blue"} key={index}>
                                    {tag.username}
                                </Tag>
                            );
                        })}
                    </>
                )
            },
        },
        {
            title: 'Nạn nhân cần cứu',
            key: 'victims',
            className:" w-1/4",
            dataIndex: 'victims',
            render: (data,index) => {
                return (
                    <>
                        {data.map((tag) => {
                            return (
                                <Tag color={"blue"} key={index}>
                                    {tag.username}
                                </Tag>
                            );
                        })}
                    </>
                )
            },
        },
        {
            title: '',
            key: 'action',
            className:'w-[120px]',
            render: (_, record) => (
                <Space size="middle" align='center' className='justify-center'>
                    <Button type="primary" color="#F25624"
                            onClick={()=>{
                                setSelectedRow(record)}
                            }
                    >Chỉnh sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa đội này?"
                        onConfirm={()=>{}}
                        onCancel={()=>{}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    return <div>
        {contextHolder}
        <Header breadScrum={breadScumb} title={"Danh sách đội cứu hộ"} actions={actions}></Header>
        <Section>
            <div className='flex gap-[10px] items-center mb-[10px]'>
                <Input placeholder='Tìm kiếm theo tên'></Input>
                <Button type="primary">Tìm kiếm</Button>
            </div>

            <div>
                <Table columns={columns} dataSource={teams} rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}></Table>
            </div>
        </Section>

        <Modal
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

    </div>
}

export default ManageTeam;