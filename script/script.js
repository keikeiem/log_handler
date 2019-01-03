function LogHandler(args) {
    args = args || {};
    this._GLOBAL_DEBUG_ = false;
    this._LOCAL_DEBUG_ = new Map();

    this._EXP_TIME_ = 300;
    // Object.seal(this);
}

LogHandler.prototype.author = 'kimkm (keikeiem@naver.com)';
LogHandler.prototype.name = 'LogHandler';
LogHandler.prototype._PRINT_ = function(value, key) {
    var mapKey = location.hash || 'default';
    if (!this._GLOBAL_DEBUG_)
    {
        if (!this._LOCAL_DEBUG_.get(mapKey) || !this._LOCAL_DEBUG_.get(mapKey).debug) return;
        this._LOCAL_DEBUG_.get(mapKey).expiration = Math.floor(new Date().getTime() / 1000);
    }

    var lineInfo = this._GET_LINE_INFO_('_PRINT_');

    var string = '';
    string += (key ? key + ': ' : 'no label: ');
    console.log(string, value, lineInfo);
};

LogHandler.prototype._PRINTS_ = function(valueArr, keyArr) {
    keyArr = keyArr || [];
    var mapKey = location.hash || 'default';
    if (!this._GLOBAL_DEBUG_)
    {
        if (!this._LOCAL_DEBUG_.get(mapKey) || !this._LOCAL_DEBUG_.get(mapKey).debug) return;
        this._LOCAL_DEBUG_.get(mapKey).expiration = Math.floor(new Date().getTime() / 1000);
    }

    var lineInfo = this._GET_LINE_INFO_('_PRINTS_')

    var string;
    for (var i = 0; i < valueArr.length; i++)
    {
        string = '';
        string += (keyArr[i] ? keyArr[i] + ': ' : (i + 'th value: '));
        console.log(string, valueArr[i], lineInfo);
    }
};

LogHandler.prototype._SET_GLOBAL_DEBUG_ = function(statement) {
    this._GLOBAL_DEBUG_ = Boolean(statement);
    console.log('[LogHandler-GLOBAL] declared on : ', this._GET_LINE_INFO_('_SET_GLOBAL_DEBUG_'));
};

LogHandler.prototype._SET_LOCAL_DEBUG_ = function(statement) {
    var mapKey = location.hash || 'default';
    this._LOCAL_DEBUG_.set(mapKey, {
        debug: Boolean(statement),
        expiration: Math.floor(new Date().getTime() / 1000)
    });

    this._RUN_CLEARANCE_();
    var lineInfo = this._GET_LINE_INFO_('_SET_LOCAL_DEBUG_');
    console.log('[LogHandler-LOCAL] declared on : ', lineInfo);
};

LogHandler.prototype._GET_LINE_INFO_ = function(identifier) {
    var msgIndex;
    try {
        throw(_UNDEFINED_VALUE);
    }
    catch(e) {
        var stack = e.stack.split('\n');
        stack.forEach(function(message, idx) {
            if (message.indexOf(identifier) > -1)
            {
                msgIndex = idx;
            }
        });
    } finally {
        var result = stack[(msgIndex + 1)];
        result = result.substring(result.indexOf('http://'));
        if (result.indexOf(')') > -1)
        {
            result = result.substring(0, result.length - 1);
        }
    }
    return result;
};

LogHandler.prototype._RUN_CLEARANCE_ = function() {
    var _this = this;

    if (!this._CLEARANCE_)
    {
        this._CLEARANCE_ = setInterval(function() {
            _this._NEW_DATE_ = Math.floor(new Date().getTime() / 1000);
            var deleteCandidate = [];
            _this._LOCAL_DEBUG_.forEach(function(item, key) {
                if (_this._NEW_DATE_ > (item.expiration + _this._EXP_TIME_))
                {
                    deleteCandidate.push(key);
                }
            });

            deleteCandidate.forEach(function(key) {
                _this._LOCAL_DEBUG_.delete(key);
            });

            if (_this._LOCAL_DEBUG_.size === 0)
            {
                clearInterval(_this._CLEARANCE_);
                delete _this._CLEARANCE_;
            }
        }, 60 * 1000);    }
};

if (!window.BroswerLogs) {
    window.BrowserLogs = new LogHandler();
}
