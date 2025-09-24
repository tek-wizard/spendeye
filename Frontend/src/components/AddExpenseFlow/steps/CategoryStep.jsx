import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const categories = ['Housing', 'Utilities', 'Food', 'Transportation', 'Health', 'Education', 'Entertainment', 'Shopping', 'Miscellaneous'];

export const CategoryStep = ({ formData, updateFormData }) => (
  <>
    <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
      What did you spend on?
    </Typography>
    
    <FormControl sx={{ m: 1, minWidth: 240, maxWidth: '80%' }}>
      <InputLabel id="category-select-label">Category</InputLabel>
      <Select
        labelId="category-select-label"
        value={formData.category}
        label="Category"
        onChange={(e) => updateFormData({ category: e.target.value })}
        autoWidth
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 250,
            },
          },
        }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </>
);

export default CategoryStep