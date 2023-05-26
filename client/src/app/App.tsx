import {useState} from "react";
import {App as AntApp, Button, ConfigProvider, Layout, theme} from "antd";
import Users from "./Users";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Gallery from "./Gallery";

const {Header, Footer, Sider, Content} = Layout;


const routes = createBrowserRouter([
    {
        path: '/',
        element: <Users/>
    },
    {
        path: ':group_url',
        element: <Gallery/>
    },
    {
        path: '/1',
        element: <div>123</div>
    }
])

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const handleClick = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <AntApp>
                <Layout style={{height: '100vh', overflow: 'clip'}}>
                    <Header>
                        <Button onClick={handleClick}>
                            Change Theme to {isDarkMode ? "Light" : "Dark"}
                        </Button>
                    </Header>
                    <Content style={{height: '100%', overflow: 'clip'}}>
                        <RouterProvider router={routes}/>
                    </Content>
                </Layout>
            </AntApp>
        </ConfigProvider>
    )
}