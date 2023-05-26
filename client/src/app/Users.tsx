import {useEffect, useState} from "react";
import {getExcelData} from "../api/api";
import {Col, Descriptions, Input, Layout, Row, Table, Tooltip, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {InfoCircleFilled} from "@ant-design/icons";

const {Content, Header} = Layout;
const {Search} = Input;
const {Paragraph} = Typography;

export default function Users() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([] as any[]);
    const [filteredUsers, setFilteredData] = useState([] as any[]);

    useEffect(() => {
        setLoading(true);
        getExcelData().then(data => {
            setUsers(data);
            setFilteredData(data);
            setLoading(false);
        })
    }, [])

    const navigate = useNavigate();

    const onCell = (record: any) => ({
        onClick: () => {
            if (!record.group_url) return;
            navigate(`${record.group_url.split('https://vk.com/')[1]}`)
        }
    })

    const columns: any[] = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            onCell: onCell
        },
        {
            title: 'Ник',
            dataIndex: 'nickname',
            key: 'nickname',
            onCell: onCell
        },
        {
            title: '',
            key: 'operation',
            width: 100,
            align: 'center',
            render: (record: any) => {
                if (record.group_url) return;
                return <Tooltip title="group_url is missed">
                    <InfoCircleFilled style={{fontSize: '18px'}}/>
                </Tooltip>;
            },
        },
    ]

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (!value) setFilteredData(users);
        // TODO: Поиск по всем полям, задавать поля для поиска через параметры
        let filtered = users.filter(user => user?.name?.includes(value) || user?.nickname?.includes(value));
        setFilteredData(filtered);
    };

    const rowClassName = (record: any, idx: number) => {
        if (!record.group_url) return 'field_missed';
        return 'row';
    }

    return (
        <>
            <Row>
                <Col style={{padding: '10px 10px 0px 10px'}} span={24}>
                    <Search style={{marginBottom: 10}} onChange={onFilterChange} loading={loading}/>
                </Col>
            </Row>
            <Row>
                <Col style={{padding: '10px 10px 0px 10px'}} span={24}>
                    <Table loading={loading}
                           scroll={{y: '74vh'}}
                           pagination={{defaultPageSize: 100}}
                           dataSource={filteredUsers}
                           columns={columns}
                           rowKey={(row) => row.id}
                           bordered
                           rowClassName={(record, idx) => rowClassName(record, idx)}
                           expandable={{
                               expandedRowRender: (record) => (
                                   <Descriptions layout="vertical">
                                       {Object.entries(record)
                                           .filter(([key, value]) => !columns.find(col => col.dataIndex === key))
                                           .filter(([key, value]) => value && key !== 'id')
                                           .map(([key, value]: [string, any]) => {
                                               return <Descriptions.Item label={key}>
                                                   <Paragraph copyable>{value}</Paragraph>
                                               </Descriptions.Item>
                                           })}
                                   </Descriptions>
                               )
                           }}
                    >
                    </Table>
                </Col>
            </Row>
        </>


        // <div style={{display: "flex", flexDirection: 'column', height: '100%', padding: 20}}>
        //     <Input style={{marginBottom: 10}} onChange={onFilterChange}/>
        //
        //     <Table scroll={{y: '100vh'}}
        //            dataSource={filteredUsers}
        //            columns={columns}>
        //     </Table>
    )
}