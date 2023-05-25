import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex)
export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    pAuth: false,
    pUserEmail: "",
    pUSerRole: "",
    pLoginStatus: false,
    pCurrentObj: "",
    pCustId: "",
    pAffiliation: "",
    pWiredLan: false,
    pIPsettings: {},
    pDhcpServer: {},
    pDhcpReservation: {},
    pWirelessLan: false,
    pPrimaryNetwork: {},
    pGuestNetwork: {},
    pAccessControl: {},
    userDetails: {},
    pDefaultConfig: {},
    ipv4Object: {},
    routerDetailObject: {},
    routerConfigurationObject: {},
    pSystem: false,
    pMiscSettings: {},
    pNTPTimer: {},
    pRouterAdmin: [],
    pReportSets: {},
    pAlertSets: {},
    pAutoReboot: {},
    pWebconnection: "",
    pAlerts: [],
    pFirewall: false,
    pFirewalGeneral: {},
    pUrlFilter: {},
    pValidExcelData: [],
    pValidHeaders: [],
    pContentFilter: {},
    pServiceFilter: {},
    pParentControl: {},
    pDataUsage: {},
    pInternet: false,
    pInteretObject: {},
    pDynamicDns: {},
    pDmzObject: {},
    pNATPassthrough: {},
    pIPv6Settings: {},
    pIPv4Settings: {},
    pPortForward: {},
    pAlertsConnection: [],
    pDynamicTableData: [],
    pDynamicHeaders: [],
    pLicensePartner: {},
    pCarrierPartner: {},
    pRouterGroups: false,
    PModemGeneral: {},
    pSimData: {},
    pApnInfo: {},
    pSmsInfo: {},
    pGpsInfo: {},
    pMiscInfo: {},
    pUpnp: {},
    pEthernetInfo: {},
    pCaptivePortal: {},
    pDosInfo: {},
    pLoopBack: {},
    pStromCon: {},
    pTodAcces: {},
    pMarketplaceCount: 0,
    pCongifStatusCheck: false,
    pCompanyDetail: false,
    pGetGroupID:"",

  },
  getters: {
   
    GetAuth: state => {
      return state.pAuth || false;
    },
   
    GetUserEmail: state => {
      return state.pUserEmail;
    },
   
    GetUserRole: state => {
      return state.pUSerRole;
    },
    GetLoginStatus: state => {
      return state.pLoginStatus;
    },
    
    GetCurrentObj: state => {
      return state.pCurrentObj;
    },
    
    GetCustID: state => {
      return state.pCustId;
    },
    
    GetAffiliation: state => {
      return state.pAffiliation;
    },

    GetWiredLan: state => {
      return state.pWiredLan;
    },

    GetIPsettings: state => {
      return state.pIPsettings;
    },

    GetDhcpServer: state => {
      return state.pDhcpServer;
    },

    GetDhcpReservation: state => {
      return state.pDhcpReservation;
    },

    GetWirelessLan: state => {
      return state.pWirelessLan;
    },

    GetPrimaryNetwork: state => {
      return state.pPrimaryNetwork;
    },

    GetGuestNetwork: state => {
      return state.pGuestNetwork;
    },

    GetAccessControl: state => {
      return state.pAccessControl;
    },

    get_current_user_details: state => {
      return state.userDetails;
    },

    GetDefaultConfig: state => {
      return state.pDefaultConfig;
    },
    GetIpV4: state => {
      return state.ipv4Object;
    },
    get_current_router_detail_object: state => {
      return state.routerDetailObject;
    },

    GetSystem: state => {
      return state.pSystem;
    },

    GetMiscSettings: state => {
      return state.pMiscSettings;
    },

    GetNTPTimer: state => {
      return state.pNTPTimer;
    },

    GetRouterAdmin: state => {
      return state.pRouterAdmin;
    },

    GetReportSets: state => {
      return state.pReportSets;
    },

    GetAutoReboot: state => {
      return state.pAutoReboot;
    },

    GetAlertSets: state => {
      return state.pAlertSets;
    },

    GetWebconnection: state => {
      return state.pWebconnection;
    },

    GetAlerts: state => {
      return state.pAlerts;
    },

    GetFirewall: state => {
      return state.pFirewall;
    },

    GetFirewalGeneral: state => {
      return state.pFirewalGeneral;
    },

    GetUrlFilter: state => {
      return state.pUrlFilter;
    },
    GetValidExcelData: state => {
      return state.pValidExcelData;
    },
    GetValidHeaders: state => {
      return state.pValidHeaders;
    },
    GetContentFilter: state => {
      return state.pContentFilter;
    },
    GetServiceFilter: state => {
      return state.pServiceFilter;
    },
    GetParentControl: state => {
      return state.pParentControl;
    },
    GetDataUsage: state => {
      return state.pDataUsage;
    },
    GetAlertsConnection: state => {
      return state.pAlertsConnection;
    },

    GetInternet: state => {
      return state.pInternet;
    },

    GetInteretObject: state => {
      return state.pInteretObject;
    },

    GetDynamicDns: state => {
      return state.pDynamicDns;
    },
    GetNATPassthrough: state => {
      return state.pNATPassthrough;
    },
    GetIPv6Settings: state => {
      return state.pIPv6Settings;
    },
    GetDmzObject: state => {
      return state.pDmzObject;
    },

    GetPortForward: state => {
      return state.pPortForward;
    },

    GetDynamicTableData: state => {
      return state.pDynamicTableData;
    },
    GetDynamicHeaders: state => {
      return state.pDynamicHeaders;
    },
    GetLicensePartner: state => {
      return state.pLicensePartner;
    },
    GetCarrierPartner: state => {
      return state.pCarrierPartner;
    },

    GetRouterGroups: state => {
      return state.pRouterGroups;
    },
    GetModemGeneral: state => {
      return state.PModemGeneral;
    },
    GetSimData: state => {
      return state.pSimData;
    },
    GetApnInfo: state => {
      return state.pApnInfo;
    },
    GetSmsInfo: state => {
      return state.pSmsInfo;
    },
    GetGpsInfo: state => {
      return state.pGpsInfo;
    },
    GetMiscInfo: state => {
      return state.pMiscInfo;
    },
    GetUpnpInfo: state => {
      return state.pUpnp;
    },
    GetEthernetInfo: state => {
      return state.pEthernetInfo;
    },
    GetCaptivePortal: state => {
      return state.pCaptivePortal;
    },
    GetDosInfo: state => {
      return state.pDosInfo;
    },
    GetLoopBack: state => {
      return state.pLoopBack;
    },
    GetStromControl: state => {
      return state.pStromCon;
    },
    GetTodAcces: state => {
      return state.pTodAcces;
    },


    GetMarketplaceCount: state => {
      return state.pMarketplaceCount;
    },
    GetCongifStatusCheck: state => {
      return state.pCongifStatusCheck;
    },
    GetCompanyDetail: state => {
      return state.pCompanyDetail;
    },
    GetGetGroupID: state => {
      return state.pGetGroupID;
    },
    

  },
  mutations: {
  
    SetAuth(state, status) {
      state.pAuth = status;
    },
    
    SetUserEmail(state, useremail) {
      state.pUserEmail = useremail;
    },
    
    SetUserRole(state, status) {
      state.pUSerRole = status;
    },
   
    SetLoginStatus(state, status) {
      state.pLoginStatus = status;
    },
   
    SetCurrentObj(state, status) {
      state.pCurrentObj = status;
    },
   
    SetCustId(state, status) {
      state.pCustId = status;
    },
   
    SetAffiliation(state, status) {
      state.pAffiliation = status;
    },
    set_current_user_details(state, userDetails) {
      state.userDetails = userDetails;
    },
    SetIPV4(state, ipv4Object) {
      state.ipv4Object = ipv4Object;
    },
    SetWiredLan(state, wiredlan) {
      state.pWiredLan = wiredlan;
    },
    set_current_router_detail_object(state, routerDetailObject) {
      state.routerDetailObject = routerDetailObject;
    },
    SetWebconnection(state, status) {
      state.pWebconnection = status;
    },

       SetIPsettings(state, status) {
      state.pIPsettings = status;
    },
    SetDhcpServer(state, dhcpserver) {
      state.pDhcpServer = dhcpserver;
    },
    SetDhcpReservation(state, dhcpreservation) {
      state.pDhcpReservation = dhcpreservation;
    },
    SetWirelessLan(state, wirelesslan) {
      state.pWirelessLan = wirelesslan;
    },
    SetPrimaryNetwork(state, primarynetwork) {
      state.pPrimaryNetwork = primarynetwork;
    },
    SetGuestNetwork(state, guestnetwork) {
      state.pGuestNetwork = guestnetwork;
    },
    SetAccessControl(state, accesscontrol) {
      state.pAccessControl = accesscontrol;
    },
    SetDefaultConfig(state, defaultconfig) {
      state.pDefaultConfig = defaultconfig;
    },
    SetSystem(state, system) {
      state.pSystem = system;
    },
    SetMiscSettings(state, miscsettings) {
      state.pMiscSettings = miscsettings;
    },
    SetNTPTimer(state, ntptimer) {
      state.pNTPTimer = ntptimer;
    },
    SetRouterAdmin(state, routeradmin) {
      state.pRouterAdmin = routeradmin;
    },
    SetReportSets(state, reportset) {
      state.pReportSets = reportset;
    },
    SetAlerts(state, alertItem) {
      state.pAlerts.push(alertItem);
    },
    SetFirewall(state, firewall) {
      state.pFirewall = firewall;
    },
    SetFirewalGeneral(state, firewalgeneral) {
      state.pFirewalGeneral = firewalgeneral;
    },
    SetUrlFilter(state, urlfilter) {
      state.pUrlFilter = urlfilter;
    },
    SetValidExcelData(state, excelData) {
      state.pValidExcelData = excelData;
    },
    SetValidHeaders(state, excelData) {
      state.pValidHeaders = excelData;
    },
    SetAlertSets(state, alertsets) {
      state.pAlertSets = alertsets;
    },
    SetAutoReboot(state, autoreboot) {
      state.pAutoReboot = autoreboot;
    },
    SetContentFilter(state, content) {
      state.pContentFilter = content;
    },
    SetServiceFilter(state, servicefilter) {
      state.pServiceFilter = servicefilter;
    },
    SetParentControl(state, parentcontorl) {
      state.pParentControl = parentcontorl;
    },
    SetDataUsage(state, usage) {
      state.pDataUsage = usage;
    },
    SetInternet(state, internet) {
      state.pInternet = internet;
    },
    SetInteretObject(state, intenetObj) {
      state.pInteretObject = intenetObj;
    },
    SetDynamicDns(state, dynamicdns) {
      state.pDynamicDns = dynamicdns;
    },
    SetNATPassthrough(state, nat) {
      state.pNATPassthrough = nat;
    },
    SetIPv6Settings(state, ipv6) {
      state.pIPv6Settings = ipv6;
    },
    SetDmzObject(state, dmz) {
      state.pDmzObject = dmz;
    },
    SetPortForward(state, portforward) {
      state.pPortForward = portforward;
    },
    SetAlertsConnection(state, alertItem) {
      state.pAlertsConnection.push(alertItem);
    },
    SetDynamicTableData(state, dynamicTable) {
      state.pDynamicTableData = dynamicTable;
    },
    SetDynamicHeaders(state, dynamicHeader) {
      state.pDynamicHeaders = dynamicHeader;
    },
    SetLicensePartner(state, license) {
      state.pLicensePartner = license;
    },
    SetCarrierPartner(state, partner) {
      state.pCarrierPartner = partner;
    },
    SetRouterGroups(state, routerGroup) {
      state.pRouterGroups = routerGroup;
    },
    SetModemGeneral(state, general) {
      state.PModemGeneral = general;
    },
    SetSimData(state, sim) {
      state.pSimData = sim;
    },
    SetApnInfo(state, apn) {
      state.pApnInfo = apn;
    },
    SetSmsInfo(state, sms) {
      state.pSmsInfo = sms;
    },
    SetGpsInfo(state, gps) {
      state.pGpsInfo = gps;
    },
    SetMiscInfo(state, misc) {
      state.pMiscInfo = misc;
    },
    SetUpnpInfo(state, upnp) {
      state.pUpnp = upnp;
    },
    SetEthernetInfo(state, eth) {
      state.pEthernetInfo = eth;
    },
    SetDosInfo(state, dos) {
      state.pDosInfo = dos;
    },
    SetLoopBack(state, loopback) {
      state.pLoopBack = loopback;
    },
    SetStromControl(state, strom) {
      state.pStromCon = strom;
    },
    SetTodAcces(state, tod) {
      state.pTodAcces = tod;
    },
    SetCaptivePortal(state, captive) {
      state.pCaptivePortal = captive;
    },

    SetMarketplaceCount(state, status) {
      state.pMarketplaceCount = status;
    },
    SetCongifStatusCheck(state, status) {
      state.pCongifStatusCheck = status;
    },

    SetCompanyDetail(state, status) {
      state.pCompanyDetail = status;
    },
    SetGetGroupID(state, groupId) {
      state.pGetGroupID = groupId;
    },
    
  },
  actions: {
    removeAuth(context) {
      context.commit("SetUserEmail", "");
    }
  },
  modules: {}
})