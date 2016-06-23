var stringUtil = require('util');
exports.messages = {
  'ACTIONABLE': {
    true : function() {
        return 'success';
    },
    false : function(action, actionable) {
        return stringUtil.format("%s can not be performed on %s", action, actionable);
    }
  }
}
