import api from "~/api";

export const state = () => ({
  type: null,
  form_fields: null,
  headers: null,
  show_form_dialog: null,
  page: null,
  posts: null,
  loading: null,
  total_posts_length: null,
  table_params: null,
  filters: null,
  export_fields: null,
  custom_fields: null,
  menu_links: null,
})

export const mutations = {

  setFormFields (state, data){
    state.form_fields = data;
  },

  setType(state,data){
    state.type = data;
  },

  setPage(state, data){
    state.page = data;
  },

  setHeaders(state, data){
    state.headers = data;
  },

  setPosts(state, data){
    state.posts = data;
  },

  setFilters(state, data){
    state.filters = data;
  },

  setExportFields(state, data){
    state.export_fields = data;
  },

  setCustomFields(state, data){
    state.custom_fields = data;
  },

  setMenuLinks(state, data){
    state.menu_links = data;
  },

  setTotalPostsLength(state, data){
    state.total_posts_length = data;
  },

  showFormDialog(state,data){
    state.show_form_dialog = data;
  },

  setTableParams(state,data){
    state.table_params = data;
  }
}

export const actions = {

  setTableType({commit,state},data){
    commit('setType',data);

    return state.type;
  },

  setTablePage({commit,state},data) {

    commit('setPage',data);

    return state.model;
  },

  showFormDialog({commit,state},data){
    commit('showFormDialog',data)

    return state.show_form_dialog;
  },

  setTableParams({commit,state}, data) {
    commit('setTableParams',data)

    return state.table_params;
  },

  setTableHeaders({commit, rootGetters, state}){

    return api.auth.general({
      method: 'get-table-headers',
      page: state.page,
      token: rootGetters["auth/token"]
    })
    .then(response => {
      commit('setHeaders', response.data.original)
      return response
    })
    .catch(error => {
      commit('setHeaders', null)
      return error
    })
  },

  setTablePosts({commit, rootGetters, state}) {
    return api.auth.general({
      method: 'get-table-data',
      slug: state.page,
      token: rootGetters["auth/token"],
      item_per_page: state.table_params ? state.table_params.itemsPerPage : 10,
      page: state.table_params ? state.table_params.page : 1,
      options: state.table_params,
    })
    .then(response => {
      commit('setPosts', response.data.original.data)
      commit('setTotalPostsLength', response.data.original.total)

      return response
    })
    .catch(error => {
      commit('setPosts', null)
      return error
    })
  },

  setTableForm({commit,rootGetters,state},data){

    //refresh the form_fields data

    return api.auth.general({
      method: 'get-form-fields',
      page: state.page,
      token: rootGetters["auth/token"],
      instance_id: data.instance_id
    })
    .then(response => {
      commit('setFormFields', response.data.original)
      console.log('setFormFields',response.data.original)
      return response
    })
    .catch(error => {
      commit('setFormFields',null);
      return error
    })
  },

  clearTableForm({commit}){
    commit('setFormFields',null)
  },

  setTableFilters({commit, rootGetters}) {
    return api.auth.general({
      method: 'get-table-filters',
      page: this.state.page,
      token: rootGetters["auth/token"]
    })
    .then(response => {
      commit('setFilters', response.data)
      return response
    })
    .catch(error => {
      commit('setFilters', null)
      return error
    })
  },

  setTableExportFields({commit, rootGetters,state}){
    return api.auth.general({
      method: 'get-export-fields',
      page: state.page,
      token: rootGetters["auth/token"]
    })
    .then(response => {

      commit('setExportFields', response.data.original)
      return response
    })
    .catch(error => {
      commit('setExportFields', null)
      return error
    })
  },

  setTableCustomFields({commit, rootGetters}){
    return api.auth.general({
      method: 'get-custom-fields',
      page: this.state.page,
      token: rootGetters["auth/token"]
    })
    .then(response => {
      commit('setCustomFields', response.data)
      return response
    })
    .catch(error => {
      commit('setCustomFields', null)
      return error
    })
  },

  setTableMenuLinks({commit, rootGetters}) {

    return api.auth.general({
      method: 'get-menu-links',
      token: rootGetters["auth/token"],
    })
    .then(response => {


      commit('setMenuLinks', response.data.original)
      return response
    })
    .catch(error => {
      //console.log('error setTableMenuLinks',error.response.data.error)

      commit('setMenuLinks', null)
      return error
    })
  },

  createRecord({commit,dispatch,rootGetters,state},data){
    return api.auth.general({
      method: 'create-record',
      token: rootGetters["auth/token"],
      page: state.page,
      form_data: data,
    })
    .then(response => {
      //fetch data after creating record
      commit('showFormDialog',false)
      dispatch('setTablePosts')

      return response

    }).catch(err => {

      commit('showFormDialog',false)
      dispatch('setTablePosts')
      //this.closeDialog()

      return err
    });
  },

  updateRecord({commit, dispatch,rootGetters,state},data){
    return api.auth.general({
      method: 'update-record',
      token: rootGetters["auth/token"],
      page: state.page,
      form_data: data,
      instance_id: data.instance_id
    })
    .then(response => {
        //fetch data after creating record
        commit('showFormDialog',false)
        dispatch('setTablePosts')

        return response

    }).catch(err => {

        commit('showFormDialog',false)
        dispatch('setTablePosts')
        //this.closeDialog()

        return err
      });
  },


  exportTable({commit, dispatch,rootGetters,state},data){
    return api.auth.general({
      method: 'export',
      token: rootGetters["auth/token"],
      page: state.page,
      form_data: data,
      options: state.table_params,
    }, {
      responseType: 'blob'
    })
  }

  //handleEndSession()
}
