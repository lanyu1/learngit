/**
 * Created by cheon on 6/28/17.
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {observer, inject } from 'mobx-react'
import { Table, Icon, Button, Spin, Pagination, Tooltip } from 'antd';
import Remove from '../../../components/Remove';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';

@inject("AppState")
@observer
class Lookup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: '',
            page: 0,
            size: 10,
            totalElements: 0,
            organizationId: this.props.AppState.currentMenuType.id,
        }
    };

    componentDidMount(){
        this.loadLookups(this.state.organizationId, this.state.page, this.state.size);
    }

    loadLookups = (organizationId, page, size) => {
        this.props.LookupStore.loadLookups(organizationId, page, size);
    };

    handleOpen = (id) => {
        this.setState({open: true, lookupId: id,});
    };

    handleClose = (e) => {
        this.setState({open: false});
    };

    handleDelete = (e) => {
        this.setState({open: false});
        this.props.LookupStore.deleteLookupById(this.state.organizationId, this.state.lookupId).then(()=>{this.loadLookups(this.state.organizationId, this.state.page, this.state.size)})
    };

    linkToChange = (url) => {
      const { history } = this.props;
      history.push(url);
    };

    onEdit = (id) => {
        this.linkToChange(`lookup/edit/${id}`);
    };

    onCreate = () => {
        this.linkToChange(`lookup/create`);
    };

    render(){
//{{{ define table columns
        const columns = [
            {
                title: HAP.languageChange("lookup.code"),
                dataIndex: 'code',
                key: 'code'
            }, {
                title: HAP.languageChange("lookup.description"),
                dataIndex: "description",
                key: 'description'
            },
            {
                title: <div style={{textAlign: "center"}}>{HAP.languageChange("lookup.action")}</div>,
                className: "operateIcons",
                key: "action",
                render: (text, record) => {
                    return (
                    <div style={{textAlign: 'center'}}>
                        <Tooltip title={HAP.languageChange("lookup.edit")} placement="bottom" getTooltipContainer={(that) => that}>
                        <a className="operateIcon small-tooltip" onClick={this.onEdit.bind(this, record.lookupId)}>
                            <Icon type="edit"/>
                        </a>
                        </Tooltip>
                        <Tooltip title={HAP.languageChange("lookup.delete")} placement="bottom" getTooltipContainer={(that) => that}>
                        <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.lookupId)} disabled={record.isEdit==="N"}>
                            <Icon type="delete" style={{color: record.isEdit === "N" ? "#B9C0C8" : "#08ABF4"}}/>
                        </a>
                        </Tooltip>
                    </div>
                    )
                }
            }
        ];
//}}}

        const loading = (
            <div>
                <Spin size="default" style={{position: "fixed", bottom: "50%", left: "50%"}}/>
            </div>
        );

        return(
            <div>
                <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete.bind(this)}/>
                <PageHeader title={HAP.languageChange("lookup.title")}>
                    <Button className="header-btn" ghost={true} onClick={() => {this.onCreate()}} style={PageHeadStyle.leftBtn} icon="code-o">
                        {HAP.languageChange("lookup.createCode")}
                    </Button>

                    <Button className="header-btn" ghost={true} onClick={()=>{this.loadLookups(this.state.organizationId, this.state.page, this.state.size)}} style={PageHeadStyle.leftBtn} icon="reload">
                        {HAP.languageChange("flush")}
                    </Button>
                </PageHeader>

                <div style={{margin: 20,}}>
                    {this.props.LookupStore.getIsLoading ? loading : (
                        <div>
                            <Table columns={columns} dataSource={this.props.LookupStore.getLookups} rowKey="lookupId" pagination={false}/>
                            <div style={{float: 'right', marginTop: 8, display: this.state.isLoading ? 'none' : 'block'}}>
                              <Pagination total={this.props.LookupStore.getTotalSize} pageSize={this.state.size} current={this.state.page + 1} onChange={page => {this.setState({page: page-1}); this.loadLookups(this.state.organizationId, page - 1, this.state.size)}}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default withRouter(Lookup)

