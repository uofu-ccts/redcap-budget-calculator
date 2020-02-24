/**
 * Library of utility methods for use with the Budget Calculator.
 */
class BudgetUtils 
{
  constructor ()
  {}

  toDollars(dollars) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(dollars);
  }

}

export default BudgetUtils;