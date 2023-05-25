import {
    Line
} from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        chartdata: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: null
        },
        count: Number
    },
    watch: {
        count(val) {
            if (val == 1) {
                this.renderChart(this.chartdata, this.options)
            }
        }
    },
    mounted() {
        this.renderChart(this.chartdata, this.options)
    }
}