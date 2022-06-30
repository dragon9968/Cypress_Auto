export function parse_url(url){
    var map_type = ""
    var collection_category = ""
    if (url.includes('editor')){
        if (url.includes('enclave')){
            map_type = 'ee'
        }else{
            map_type = 'e'
        }
    } else if (url.includes('viewer')){
        if (url.includes('enclave')){
            map_type = 'ev'
        }else{
            map_type = 'v'
        }
    }else if (url.includes('dashboard')){
        map_type = 'd'
    }else if (url.includes('rangeview')){
        map_type = 'r'
    }else{
        map_type = ""
    }
    if(url.includes('logical') || url.includes('dashboard') || url.includes('rangeview')){
        collection_category = 'logical'
    } else if(url.includes('management')){
        collection_category = 'management'
    }else {
        collection_category = ''
    }
    return [map_type, collection_category]
}

export function hexToRGB(hex_color: string){
    var hexPattern = '#d{0,}'
    var hexPatternFound = hex_color.match(hexPattern)
    if (hexPatternFound) {
        var r = parseInt(hex_color.slice(1, 3), 16).toString()
        var g = parseInt(hex_color.slice(3, 5), 16).toString()
        var b = parseInt(hex_color.slice(5, 7), 16).toString()
        return "rgb(" + r + ',' + g + ',' + b + ")"
    }
}