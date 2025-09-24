export * from './AmountStep';
export * from './CategoryStep';
export * from './ConfirmStep';
export * from './ContactsStep';
export * from './DateStep';
export * from './NotesStep';
export * from './ShareStep';
export * from './SplitStep';
export * from './LockedExpenseStep';


/*you have created a basic feature with allneeds fullfilled...now lets polish the ui of that flow

1."add new expense"...between those navigation buttons...once the user enters the amount and move to next slide it should turn to a button with "cancel" so that user can backoff and the data gets removed from local storage and user should coe back to slide 1
2.the user should not be able to navigate further without filling the important things...should only be able to navigate further if the input is optional like notes and date
slide 1) the enter amount should be more good written with better font like in gpay or something...also the amount should be like that and the ruppee icon should be more prominent and in more center...also the input field should be less big not this big...shold look proffesional...also that increse decrease buttons on that input field should not be there 
slide 2) good slide just more good heading
slide 3) the (optional) in heading should not be as prominent more muted colour...also put a max limit of 200 words on notes
slide 4) the input field should not be as big and user should be allowed to choose future dates
slide 5) Key Features:
        Clear Question: A prominent heading asks "Shared Expense?".
        Two Choice Buttons: "Yes, it's shared" and "No, just me".
        Visual Feedback: The selected button changes appearance (e.g., solid background) to indicate its active state.
        Icons: Small cons (Users for shared, User for not shared) enhance clarity.
slide 6) Key Features:
        Header: Clear title "Select Contacts" and a descriptive subtitle.
        Selected Contacts Display:
        If formData.selectedContacts is not empty, a div displays "Selected contacts:" followed by a flexible row of badges.
        Each badge shows the contact.name.
        Each badge has a small 'X' button to removeContact when clicked.
        Badges have a distinct (e.g., teal) background to stand out.
        Contact Search (Command / Autocomplete):
        A primary interactive element for searching contacts.
        Search Input: A text input (searchValue) filters the mockContacts list dynamically as the user types (case-insensitive search by name or email).
        Search Results List: Displays filtered contacts as clickable items.
        Selection Logic:
        Clicking an item calls toggleContact.
        If the contact is already isSelected, it's removed from formData.selectedContacts.
        If not selected, it's added to formData.selectedContacts.
        Selected contacts have a Check icon (green) on the right.
        Empty State: "No contacts found." message if search yields no results.
        "Add New Contact" Option:
        A special item within the search results list, always visible (e.g., at the bottom).
        Clicking it sets showAddNew to true, revealing the "Add New Contact" form.
        "Add New Contact" Form (Conditional):
        Appears (showAddNew is true) when "Add New Contact" is selected.
        Input Field: A text input for newContactName.
        Add Button: Triggers addNewContact if newContactName is not empty. Clears input and hides the form after adding.
        Cancel Button: Hides the form.
        Enter Key Support: Pressing "Enter" in the input field should also trigger addNewContact.
slide 7)  Key Features and Interaction Details (Critical for Replication):
        Participants List Construction:
        The participants array is dynamically created, always starting with "You" (representing the current user) and then including all formData.selectedContacts.
        This ensures the user is always included in the split.
        Split Evenly Functionality (splitEvenly):
        Calculates the total formData.amount.
        Divides it equally among all current participants.
        Updates formData.splits with these calculated amounts for each participant.
        Initialization: useEffect hook ensures splitEvenly is called once when the component mounts if formData.splits is empty and participants exist. This provides a good default.
        Amount Update (updateSplit):
        Handles changes to individual participant's split amounts.
        Updates formData.splits for the specific participantId.
        Participant Removal (removeParticipant):
        Prevents removing "You".
        Removes the specified participantId from both formData.splits and formData.selectedContacts.
        This effectively removes them from the split and from the overall shared expense.
        Dynamic Totals:
        getTotalSplit(): Sums all amounts currently in formData.splits.
        getRemainingAmount(): Calculates Total Expense - Total Split. This value is crucial for user feedback.
        Header: Clear title "Split Amount" and a descriptive subtitle.
        Summary Bar:
        Displays "Total: ₹{formData.amount}", "Split: ₹{getTotalSplit().toFixed(2)}", and "Remaining: ₹{getRemainingAmount()}".
        The Split Evenly button is next to this summary.
        Individual Participant Items:
        Iterates through the participants array.
        Avatar: Displays the first letter of the participant's name (e.g., Y for "You", J for "John").
        Name: Shows the participant.name.
        Amount Input:
        A type="number" input field with step="0.01".
        Rupee Icon: An IndianRupee icon is fixed as a prefix inside the input field.
        placeholder="0.00".
        value is bound to formData.splits[id].
        onChange calls updateSplit.
        Remove Button:
        A small 'X' button, only visible for contacts (not "You").
        Clicking it calls removeParticipant.
        Hover state shows red highlighting.
        Validation / Warning:
        A warning message "⚠️ Split amounts don't match the total expense" appears if the getRemainingAmount() (absolute value) is greater than a small tolerance (e.g., 0.01), indicating an imbalance.
slide 8) Key Features and Interaction Details (Critical for Replication):
        Data Transformation:
        getCategoryDisplay(category): Takes a hyphen-separated category string (e.g., "debt-repayment") and converts it to a human-readable format (e.g., "Debt Repayment").
        participants: This array is conditionally built. If formData.isShared is true, it includes "You" with your split amount and all selectedContacts with their respective split amounts from formData.splits. If isShared is false, this array will be empty, and the shared section won't render.
        Header: Clear title "Confirm Expense" and a descriptive subtitle.
        Summary Card:
        All expense details are contained within a single Card.
        Consistent Layout: Each detail item (Amount, Category, Date, Notes, Split Between) follows a similar layout: an icon, a small descriptive label, and the actual value
        Styling: Icons are a distinct color (e.g., teal), labels are muted, and values are prominent.
        Individual Detail Display:
        Total Amount: Displays ₹{formData.amount} with an IndianRupee icon.
        Category: Displays the formatted category (getCategoryDisplay) with a Tag icon.
        Date: Displays the formatted date (format(formData.date, "PPP")) with a Calendar icon. (Note: format typically comes from a library like date-fns).
        Notes (Conditional): Only displays if formData.notes has a value. Uses a FileText icon.
        Shared Expense Details (Conditional):
        Only displays if formData.isShared is true AND there are participants.
        Uses a Users icon.
        Horizontal Scrollable List: Displays avatars and names/amounts of all participants in a horizontally scrollable container.
        Each participant has:
        An Avatar showing the first letter of their name.
        Their name.
        Their amount (e.g., ₹{participant.amount}) in a distinct color.
        Submission Button:
        A large, full-width Button at the bottom.
        Text: "Create Expense".
        onClick calls the onSubmit prop provided by the parent.




*/
