/**
 * 时区伪装脚本 - America/Los_Angeles (UTC-8)
 * 
 * 功能：将JavaScript时区API返回值伪装为洛杉矶时区
 * 作者：Claude
 * 更新：2025-01-19
 */

const TIMEZONE = 'America/Los_Angeles';
const OFFSET = 480; // UTC-8 分钟偏移

const script = `
<script>
(function() {
    const TZ = '${TIMEZONE}';
    const OFFSET = ${OFFSET};
    
    // 保存原始方法
    const _DateTimeFormat = Intl.DateTimeFormat;
    const _getTimezoneOffset = Date.prototype.getTimezoneOffset;
    const _toLocaleString = Date.prototype.toLocaleString;
    const _toLocaleDateString = Date.prototype.toLocaleDateString;
    const _toLocaleTimeString = Date.prototype.toLocaleTimeString;
    
    // 覆盖 Intl.DateTimeFormat
    Intl.DateTimeFormat = function(locales, options) {
        options = Object.assign({}, options, { timeZone: options?.timeZone || TZ });
        return new _DateTimeFormat(locales, options);
    };
    Object.setPrototypeOf(Intl.DateTimeFormat, _DateTimeFormat);
    Intl.DateTimeFormat.prototype = _DateTimeFormat.prototype;
    Intl.DateTimeFormat.supportedLocalesOf = _DateTimeFormat.supportedLocalesOf;
    
    // 覆盖 getTimezoneOffset
    Date.prototype.getTimezoneOffset = function() { return OFFSET; };
    
    // 覆盖 toLocale* 方法
    Date.prototype.toLocaleString = function(l, o) {
        return _toLocaleString.call(this, l, { ...o, timeZone: o?.timeZone || TZ });
    };
    Date.prototype.toLocaleDateString = function(l, o) {
        return _toLocaleDateString.call(this, l, { ...o, timeZone: o?.timeZone || TZ });
    };
    Date.prototype.toLocaleTimeString = function(l, o) {
        return _toLocaleTimeString.call(this, l, { ...o, timeZone: o?.timeZone || TZ });
    };
})();
</script>`;

let body = $response.body || '';

// 注入到 <head> 或 <html> 之后
if (body.includes('<head>')) {
    body = body.replace('<head>', '<head>' + script);
} else if (body.includes('<html>')) {
    body = body.replace('<html>', '<html><head>' + script + '</head>');
}

$done({ body });
