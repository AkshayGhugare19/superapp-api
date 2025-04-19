 const isSetupType = (type) => {
    const setupTypes = ["campaign_setup", "setup_commission", "setup_refund", "campaign_feature"];
    return setupTypes.includes(type);
  };

  module.exports = { isSetupType };