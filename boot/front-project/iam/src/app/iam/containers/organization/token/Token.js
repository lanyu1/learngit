/**
 * Created by song on 2017/6/27.
 */

import React, {Component} from 'react'
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import {Button,Card,Row,Col,Icon,Spin,Pagination,Tooltip} from 'antd';
import Remove from '../../../components/Remove';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';

@observer
class Token extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            open: false,
            id:'',
            page:0,
            totalElements:0,
        };
    };

    loadToken = (page) => {
        this.setState({
            page:page,
        });
        const { TokenStore } = this.props;
        TokenStore.loadToken(page, 10);
    };

    linkToChange = (url) => {
        const {history} = this.props;
        history.push(url);
    };

    componentDidMount() {
        this.loadToken(this.state.page);
    }

    handleOpen = (clientName)=> {
        this.setState({open: true, clientName: clientName});
    };

    handleClose = (event)=>{
        this.setState({open: false});
    };

    handleDelete = (event)=>{
        const {clientName} = this.state;
        let lastDatas = this.state.totalElements%10;

        this.setState({
            open:false,
            isLoading:true
        });

        const { TokenStore } = this.props;

        TokenStore.deleteToken(clientName).then(() => {
            this.setState({
                isLoading: false
            });
            this.linkToChange("/iam");
        }).catch();
    };

    render() {
        const { TokenStore } = this.props;
        let listItem = [];
        let totalElement = TokenStore ? TokenStore.getTotalSize : 1;
        let tokenData = TokenStore ? TokenStore.getTokenData : [];
        if (tokenData) {
            const that = this;
            listItem = tokenData.map((dataItem) => {
                let currentTime = new Date().getTime();
                let timeInterval = (currentTime - dataItem.tokenAccessTime);

                var days=Math.floor(timeInterval/(24*3600*1000));
                var leave1=timeInterval%(24*3600*1000);
                var hours=Math.floor((leave1%(24*3600*1000))/(3600*1000));
                var leave2=leave1%(3600*1000);
                var minutes=Math.floor((leave2%(3600*1000))/(60*1000));
                return (
                    <Card key={dataItem.clientId} style={{marginBottom:15}} bodyStyle={{padding:18}}>
                        <Row>
                            <Col span={2}>
                                <div style={{width:50,backgroundColor:"#eeeeee",fontSize:20,padding:10,borderRadius:"50%",textAlign:"center"}}>
                                    <Icon type="safety" />
                                </div>
                            </Col>
                            <Col span={20}>
                                <div style={{marginLeft:-20}}>
                                    <p style={{fontSize:20}}>{HAP.languageChange("token.clientName")}：{dataItem.clientName}</p>
                                    <p>{HAP.languageChange("token.loginCounter")}：{dataItem.tokenCount}</p>
                                    <p>{HAP.languageChange("token.lastLogin")}：{dataItem.lastTime}</p>
                                </div>
                            </Col>
                            <Col span={1} offset={1}>
                                <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that)=>that}>
                                    <a className="operateIcon small-tooltip" style={{paddingTop:"30%",display:"block"}} onClick={that.handleOpen.bind(that,dataItem.clientName)}>
                                        <Icon type="delete" />
                                    </a>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Card>
                )
            })
        };

        const loadingBar =  (
            <div style={{display:'inherit', margin:'200px auto',textAlign:"center"}}>
                <Spin />
            </div>
        );

        return (
            <div>
                <PageHeader title={HAP.languageChange("token.token")}>
                    <Button className="header-btn" ghost={true} onClick={()=>{this.loadToken(this.state.page)}} style={PageHeadStyle.leftBtn} icon="reload" >{HAP.languageChange("flush")}</Button>
                </PageHeader>
                <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete}/>

                <div style={{margin:20}}>
                    {TokenStore.getIsLoading ? loadingBar:(
                        <div>
                            {listItem}
                        </div>
                    )}
                    <div style={{float:'right', display: this.state.isLoading ? 'none' : 'block'}}>
                        <Pagination current={this.state.page+1} pageSize={10} onChange={ page => this.loadToken(page-1)} total={totalElement} />
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Token);

