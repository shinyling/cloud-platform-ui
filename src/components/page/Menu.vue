<template>
    <div class="container">
        <div class="men_tree">
            <el-tree
                    :data="menuList"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    :props="defaultProps">
            </el-tree>
        </div>
        <div class="menu_table">
            <el-button type="primary" icon="el-icon-lx-add" @click="clickAdd">新增菜单</el-button>
            <el-table
                    :data="tableData"
                    v-loading="loading"
                    stripe
                    border
                    tooltip-effect="green"
                    @sort-change='sortChange'
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="路径"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="icon"
                        label="图标"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="level"
                        label="菜单级数"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="parent"
                        label="父节点"
                        width="80">
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
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="addForm" :model="addObj" :rules="addFormRules" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addObj.name"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="url">
                    <el-input v-model="addObj.url"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="pid">
                    <el-select v-model="addObj.pid">
                        <el-option v-for="menu in parentMenSelect" :key="menu.id" :value="menu.name" :label="menu.name">{{menu.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="addObj.icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单级数" prop="level">
                    <el-input v-model="addObj.level"></el-input>
                </el-form-item>
                <el-form-item label="父节点" prop="parent">
                    <el-select v-model="addObj.parent">
                        <el-option v-for="menuParent in isParentSelect" :key="menuParent.code" :value="menuParent.msg" :label="menuParent.msg">{{menuParent.msg}}</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="editForm" :model="editObj" :rules="addFormRules"  label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editObj.name"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="url">
                    <el-input v-model="editObj.url"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="pid">
                    <el-select v-model="editObj.pid">
                        <el-option v-for="menu in parentMenSelect" :key="menu.id" :value="menu.name" :label="menu.name">{{menu.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="editObj.icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单级数" prop="level">
                    <el-input v-model="editObj.level"></el-input>
                </el-form-item>
                <el-form-item label="父节点" prop="parent">
                    <el-select v-model="editObj.parent">
                        <el-option v-for="menuParent in isParentSelect" :key="menuParent.code" :value="menuParent.msg" :label="menuParent.msg">{{menuParent.msg}}</el-option>
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
    import {loadPageData,loadParent,addMenu,editMenu,deleteMenu} from "../../api/menu";
    import {loadIsParent} from "../../api/select";
    import {Message} from "element-ui";

    export default {
        name: "Menu",
        data (){
            return {
                loading: false,
                menuList: [{
                    id: 1,
                    title: '一级 1',
                    subs: [{
                        id: 4,
                        title: '二级 1-1',
                        subs: [{
                            id: 9,
                            title: '三级 1-1-1'
                        }, {
                            id: 10,
                            title: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    title: '一级 2',
                    subs: [{
                        id: 5,
                        title: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    title: '一级 3',
                    subs: [{
                        id: 7,
                        title: '二级 3-1'
                    }, {
                        id: 8,
                        title: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'subs',
                    label: 'title'
                },
                tableData:[],
                searchData:{},
                page:{
                    total:0,
                    current:1,
                    pageSize:10
                },
                addVisible:false,
                addObj:{},
                addFormRules: {
                    name: [{ required: true, message: '请输入菜单名称'}],
                    level: [{  required: true, message: '请输入菜单级数' }],
                    parent: [{ required:true,message:'请选择是否父节点'}]
                },
                parentMenSelect:[],
                isParentSelect:[],
                editVisible: false,
                editObj:{}
            }
        },
        created() {
            this.loadData();
            this.loadSelectData();
        },
        methods:{
            loadData: function(){
                this.loading=true;
                this.searchData.page=this.page;
                return new Promise((resolve, reject) => {
                    loadPageData(this.searchData)
                        .then(response=>{
                            this.loading=false;
                            this.tableData=response.records;
                            this.page.total=response.total;
                            resolve();
                        })
                        .catch(error=>{
                            this.loading=false;
                            console.log(error);
                            this.$message.error("数据加载失败!");
                            reject();
                        })
                })
            },
            loadParentMenu: function () {
                return new Promise((resolve, reject) => {
                    loadParent()
                        .then(response=>{
                            this.parentMenSelect=response;
                            resolve();
                        })
                        .catch(error=>{
                            console.log(error);
                            this.$message.error("数据加载失败!");
                            reject();
                        })
                })
            },
            loadSelectData: function(){
                return new Promise((resolve, reject) => {
                    loadIsParent()
                        .then(response=>{
                            this.isParentSelect=response;
                            resolve();
                        })
                        .catch(error=>{
                            console.log(error);
                            this.$message.error("数据加载失败!");
                            reject();
                        })
                })
            },
            sortChange: function () {

            },
            handleEdit: function (i,row) {
                this.editVisible=true;
                this.editObj=row;
            },
            handleDelete: function (i,row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            deleteMenu(row.id)
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
                    .catch(()=>{})
            },
            handleSizeChange: function (val) {

            },
            handleCurrentChange: function (val) {

            },
            clickAdd: function () {
              this.addVisible=true;
              if(this.parentMenSelect.length==0) {
                  this.loadParentMenu();
              }
            },
            cancelAdd: function () {
                this.addVisible=false;
                this.addObj={};
            },
            saveAdd: function () {
                this.$refs['addForm'].validate((valid)=>{
                    if(valid){
                        return new Promise((resolve, reject) => {
                            addMenu(this.addObj)
                                .then(response=>{
                                    this.addVisible=false;
                                    this.$message.success("保存成功!");
                                    this.loadData();
                                    resolve();
                                })
                                .catch(error=>{{
                                    console.log(error);
                                    this.$message.error("保存失败!")
                                    reject();
                                }})
                        })

                    }
                })
            },
            cancelEdit: function () {
                this.editVisible=false;
                this.editObj={};
            },
            saveEdit: function () {
                this.$refs['editForm'].validate((valid)=> {
                    if (valid) {
                        return new Promise((resolve, reject) => {
                            editMenu(this.editObj)
                                .then(response => {
                                    this.editVisible = false;
                                    this.$message.success("修改成功!");
                                    this.loadData();
                                    resolve();
                                })
                                .catch(error => {
                                    {
                                        console.log(error);
                                        this.$message.error("修改失败!")
                                        reject();
                                    }
                                })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .men_tree{
        width: 20%;
        display: inline-block;
    }
    .menu_table{
        margin-left: 1%;
        width: 78%;
        display: inline-block;
        vertical-align:top;
    }
    .red{
        color: red;
    }
</style>
