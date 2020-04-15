<template>
    <div class="user">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="searchData.t.username" placeholder="用户名" class="handle-input mr10">
                </el-input>
                <el-input style="margin-left: 1%" v-model="searchData.t.mobile" placeholder="手机号" class="handle-input mr10"></el-input>
                <el-button style="margin-left: 1%" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-button type="primary" icon="el-icon-lx-add" @click="addUser">新增用户</el-button>
            <el-table
                    :data="tableData"
                    v-loading="loading"
                    stripe
                    border
                    tooltip-effect="green"
                    @selection-change="handleSelectionChange"
                    @sort-change='sortChange'
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        sortable
                        label="电话号码"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="锁定状态"
                        width="180">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.isLock==='未锁定'?'success':(scope.row.state==='锁定'?'danger':'')"
                        >{{scope.row.isLock}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable="custom"
                        label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :page-sizes="[10, 20, 30, 50]" small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current" :page-size="page.pageSize" layout="sizes,total,prev, pager, next" :total="page.total">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addObj" :rules="addFormRules" label-width="90px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addObj.username"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="mobile">
                    <el-input v-model="addObj.mobile"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addObj.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwordConfirm">
                    <el-input type="password" v-model="addObj.passwordConfirm"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="editObj" label-width="70px">
                <el-form-item label="用户名">
                    <el-input disabled v-model="editObj.username"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input disabled v-model="editObj.mobile"></el-input>
                </el-form-item>
                <el-form-item label="锁定状态">
                    <el-select v-model="editObj.isLock" placeholder="请选择锁定状态" >
                        <el-option v-for="lock in locks" :key="lock.code" :value="lock.msg" :label="lock.msg">{{lock.msg}}</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {loadPageData, updateUser, deleteUser, registerUser} from "../../api/user";
    import {loadIsLock} from "../../api/select"
    import {Message} from 'element-ui'

    export default {
        name: "User",
        data() {
            let reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,12}$/
            let validatePwd = (rule, value, callback) => {
                if (!reg.test(value)) {
                    callback(new Error('密码应是6-12位数字、字母或字符！'))
                }else {
                    callback()
                }
            }
            let validateConfirmPwd = (rule, value, callback) => {
                if (!reg.test(value)) {
                    callback(new Error('密码应是6-12位数字、字母或字符！'))
                } else if (this.addObj.password !== value) {
                    callback(new Error('确认密码与新密码不一致！'))
                } else {
                    callback()
                }
            }
            return {
                page: {
                    total: 0,
                    current: 1,
                    pageSize: 10
                },
                searchData: {
                    t:{},
                    page:{},
                    ascArr:[],
                    descArr:['createTime']
                },
                tableData:[],
                loading: true,
                editVisible: false,
                editObj:{},
                editObjStr:'',
                locks:[],
                addVisible: false,
                addObj: {
                    username:'',
                    mobile:'',
                    password:'',
                    passwordConfirm: ''
                },
                addFormRules:{
                    username: [{ required: true, message: '请输入用户名名'}],
                    mobile: [{  required: true, message: '请输入电话号码' }, { required: true, pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/, message: '请输入正确的电话号码'}],
                    password: [{  required: true, message: '请输入密码' },{validator:validatePwd}],
                    passwordConfirm: [{  required: true, message: '请输入密码确认'},{validator:validateConfirmPwd}]
                },
                selected:[]
            }
        },
        created() {
            this.loadData();
        },
        mounted() {
            this.loadSelect();
        },
        methods: {
            loadData: function () {
                this.loading=true;
                this.searchData.page=this.page;
                return new Promise((resolve, reject) => {
                    loadPageData(this.searchData)
                        .then(response=>{
                            this.loading=false;
                            this.page.total=response.total;
                            this.tableData=response.records;
                            resolve();
                        })
                        .catch(error=>{
                            this.loading=false;
                            reject(error);
                        })
                })
            },
            loadSelect: function(){
                return new Promise(((resolve, reject) => {
                    loadIsLock()
                        .then(response=>{
                            this.locks=response;
                            resolve();
                        })
                        .catch(error=>{
                            this.$message.error("加载锁定下拉数据失败!")
                            reject(error);
                        })
                }))
            },
            handleCurrentChange: function (val) {
                this.page.current=val;
                this.loadData();
            },
            handleSizeChange: function (val) {
                this.page.pageSize=val;
                this.loadData();
            },
            handleSearch: function () {
                this.loadData()
            },
            saveEdit: function () {
                let cur=JSON.stringify(this.editObj);
                if(cur==this.editObjStr){
                    this.$message.warning("数据未改变，保存失败!");
                }else {
                    return new Promise((resolve, reject) => {
                        updateUser(this.editObj)
                            .then(response=>{
                                Message.success("更新成功!");
                                this.editVisible=false;
                                resolve();
                            })
                            .catch(error=>{
                                Message.error("更新数据失败!");
                                reject();
                            })
                    })
                }
            },
            handleEdit: function (i,row) {
                this.editObj = row;
                this.editObjStr=JSON.stringify(row);
                this.editVisible = true;
            },
            handleDelete: function (i,row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            deleteUser(row.mobile)
                                .then(response=>{
                                    Message.success('删除成功');
                                    this.loadData();
                                })
                                .catch(error=>{
                                    console.log(error);
                                    Message.error("删除失败!")
                                })
                        })

                    })
                    .catch(() => {});
            },
            cancelEdit: function () {
                this.editObjStr='';
                this.editVisible=false;
            },
            cancelAdd: function () {
                this.addVisible=false;
                this.addObj={};
            },
            saveAdd: function () {
                this.$refs['addForm'].validate((valid)=>{
                    if(valid){
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            registerUser(this.addObj)
                                .then(response=>{
                                    this.addVisible=false;
                                    Message.success('注册用户成功！');
                                    this.loadData();
                                })
                                .catch(error=>{
                                    console.log(error);
                                    Message.error("注册用户失败!")
                                })
                        })
                    }
                });
            },
            addUser: function () {
                this.addVisible=true;
            },
            handleSelectionChange: function (arr) {
                this.selected=arr;
            },
            sortChange: function (column) {
                this.searchData.ascArr=[];
                this.searchData.descArr=[];
                let order=column.order;
                let prop=column.prop;
                if(order==='descending'){
                    this.searchData.descArr.push(prop);
                }else if (order==='ascending') {
                    this.searchData.ascArr.push(prop);
                }
                this.loadData();
            }
        }
    }
</script>

<style scoped>
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .handle-box {
        margin-bottom: 1%;
    }
    .red {
        color: #ff0000;
    }
</style>
