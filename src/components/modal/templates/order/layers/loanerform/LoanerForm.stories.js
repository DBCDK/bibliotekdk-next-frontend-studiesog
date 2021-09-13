import { LoanerForm } from "./LoanerForm";

export default {
  title: "modal/Order/LoanerForm",
};

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormNoLogin() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: false,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [
            {
              userParameterType: "cpr",
              parameterRequired: true,
            },
            {
              userParameterType: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "barcode",
              parameterRequired: true,
            },
            {
              userParameterType: "cardno",
              parameterRequired: true,
            },
            {
              userParameterType: "pincode",
              parameterRequired: true,
            },
            {
              userParameterType: "customId",
              parameterRequired: true,
            },
            {
              userParameterType: "userDateOfBirth",
              parameterRequired: true,
            },
            {
              userParameterType: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "userAddress",
              parameterRequired: true,
            },
            {
              userParameterType: "userMail",
              parameterRequired: true,
            },
            {
              userParameterType: "userTelephone",
              parameterRequired: true,
            },
          ],
          pickupAllowed: true,
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormWithLogin() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormWithLoginSubmitting() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
        submitting={true}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormSkeleton() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm skeleton={true} />
    </div>
  );
}
