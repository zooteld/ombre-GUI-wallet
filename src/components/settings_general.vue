<template>
<div class="settings-general">
    <div class="row justify-between q-mb-md">
        <div><q-radio v-model="config.daemon.type" val="local_remote" label="Local + Remote Daemon" /></div>
        <div><q-radio v-model="config.daemon.type" val="local" label="Local Daemon Only" /></div>
        <div><q-radio v-model="config.daemon.type" val="remote" label="Remote Daemon Only" /></div>
    </div>

    <p v-if="config.daemon.type == 'local_remote'">
        Get started quickly with this default option. Wallet will download the full blockchain, but use a remote node while syncing.
    </p>
    <p v-if="config.daemon.type == 'local'">
        Full security, wallet will download the full blockchain. You will not be able to transact until sync is completed.
    </p>
    <p v-if="config.daemon.type == 'remote'">
        Less security, wallet will connect to a remote node to make all transactions.
    </p>

    <q-field v-if="config.daemon.type != 'remote'">
        <div class="row gutter-sm items-end">
            <div class="col-8">
                <q-input v-model="config.daemon.rpc_bind_ip" float-label="Local Daemon IP"
                         :dark="theme=='dark'" disable />
            </div>
            <div class="col-4">
                <q-input v-model="config.daemon.rpc_bind_port" float-label="Local Daemon Port (RPC)" type="number" :decimals="0" :step="1" min="1024" max="65535" :dark="theme=='dark'" />
            </div>
        </div>
    </q-field>

    <q-field v-if="config.daemon.type != 'local'">
        <div class="row gutter-sm items-end">
            <div class="col-8">
                <q-input v-model="config.daemon.remote_host" float-label="Remote Node Host" :dark="theme=='dark'" />
            </div>
            <div class="col-4">
                <q-input v-model="config.daemon.remote_port" float-label="Remote Node Port" type="number" :decimals="0" :step="1" min="1024" max="65535" :dark="theme=='dark'" />
            </div>
        </div>

    </q-field>

    <q-field>
        <div class="row gutter-sm items-end">
            <div class="col-8">
                <q-input v-model="config.app.data_dir" stack-label="Data Storage Path" disable :dark="theme=='dark'" />
                <input type="file" webkitdirectory directory id="dataPath" v-on:change="setDataPath" ref="fileInput" hidden />
            </div>
            <div class="col-4">
                <q-btn v-on:click="selectPath"
                       :color="theme=='dark'?'dark':'standard'"
                       :text-color="theme=='dark'?'white':'dark'">
                    Select Location
                </q-btn>
            </div>
        </div>
    </q-field>

    <q-field v-if="config.daemon.type != 'remote'">
        <div class="row gutter-sm items-end">
            <div class="col-8">
                <q-select :dark="theme=='dark'"
                          v-model="config.daemon.enhanced_ip_privacy"
                          float-label="Do you plan to keep the wallet turned on 24/7?"
                          :options="enhancedPrivacyOptions"
                          />
            </div>
        </div>
    </q-field>

    <q-collapsible label="Advanced Options" header-class="non-selectable row reverse advanced-options-label">

        <q-field>
            <div class="row gutter-sm items-end">
                <div class="col-3">
                    <q-input v-model="config.daemon.log_level" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Daemon Log Level" type="number" :decimals="0" :step="1" min="0" max="4" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.wallet.log_level" :dark="theme=='dark'"
                             float-label="Wallet Log Level" type="number" :decimals="0" :step="1" min="0" max="4" />
                </div>

                <!--
                <template v-if="config.daemon.type != 'remote'">
                    <div class="col-3 self-center">
                        <q-checkbox v-model="config.daemon.enhanced_ip_privacy" label="Enhanced IP Privacy" />
                    </div>
                </template>
                -->

                <div class="col-3 self-center">
                    <q-checkbox v-model="config.app.testnet" label="Testnet" />
                </div>
            </div>
        </q-field>
        <q-field>
            <div class="row gutter-sm items-end">
                <div class="col-3">
                    <q-input v-model="config.daemon.in_peers" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Max Incoming Peers" type="number" :decimals="0" :step="1" min="-1" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.daemon.out_peers" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Max Outgoing Peers" type="number" :decimals="0" :step="1" min="-1" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.daemon.limit_rate_up" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Limit Upload Rate" type="number" suffix="kB/s" :decimals="0" :step="1" min="-1" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.daemon.limit_rate_down" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Limit Download Rate" type="number" suffix="kB/s" :decimals="0" :step="1" min="-1" max="65535" />
                </div>
            </div>
        </q-field>
        <q-field>
            <div class="row gutter-sm items-end">
                <div class="col-3">
                    <q-input v-model="config.daemon.p2p_bind_port" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Daemon P2P Port" type="number" :decimals="0" :step="1" min="1024" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.daemon.rpc_bind_port" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Daemon RPC Port" type="number" :decimals="0" :step="1" min="1024" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.daemon.zmq_rpc_bind_port" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Daemon ZMQ Port" type="number" :decimals="0" :step="1" min="1024" max="65535" />
                </div>
                <div class="col-3">
                    <q-input v-model="config.wallet.rpc_bind_port" :disable="config.daemon.type == 'remote'" :dark="theme=='dark'"
                             float-label="Wallet RPC Port" type="number" :decimals="0" :step="1" min="1024" max="65535" />
                </div>
            </div>
        </q-field>

    </q-collapsible>
</div>
</template>

<script>
import { mapState } from "vuex"
export default {
    name: "SettingsGeneral",
    data () {
        return {
            enhancedPrivacyOptions: [
                {label: "No - private network mode", value: true},
                {label: "Yes - interconnected network mode", value: false}
            ],
        }
    },
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        config: state => state.gateway.app.pending_config,
    }),
    methods: {
        selectPath () {
            this.$refs.fileInput.click()
        },
        setDataPath (file) {
            this.config.app.data_dir = file.target.files[0].path
        }
    }
}
</script>

<style lang="scss">
.settings-general {
    .q-field {
        margin: 20px 0
    }

    .q-if-disabled {
        cursor: default !important;
        .q-input-target {
            cursor: default !important;
        }
    }

    .q-item,
    .q-collapsible-sub-item {
        padding: 0;
    }
}
</style>
