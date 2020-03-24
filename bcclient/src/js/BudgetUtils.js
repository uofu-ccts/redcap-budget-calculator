/**
 * Library of utility methods for use with the Budget Calculator.
 */
class BudgetUtils 
{
  toDollars(dollars) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(dollars);
  }

  validateTotalCost(total) {
    return isNaN(total) ? 0 : total;
  }

  /**
   * For the clinical and non-clinical row components.
   */
  findYourRateByProps(props) {
    return this.findYourRate(props.fundingType, props.federalrate, props.industryrate);
  }

  /**
   * Used by BudgetProvider.addBCService().
   */
  findYourRate(fundingType, federalrate, industryrate) {
    return (fundingType==='federal_rate') ? federalrate : industryrate;
  }

  /**
   * Check if provided row is clinical.
   */
  isClinical(obj) {
      return parseInt(obj.clinical);
  }

  /**
   * Check if provided row is NOT clinical.
   */
  isNotClinical(obj) {
      return (! parseInt(obj.clinical));
  }
}

export default BudgetUtils;