import React, { useRef, useEffect } from 'react';
import { Paper, Stack, IconButton, TextField, InputAdornment, Chip, Tooltip, CircularProgress } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReplayIcon from '@mui/icons-material/Replay';
import SendIcon from '@mui/icons-material/Send';

export const QuickEntryPanel = ({
  stage,
  amount,
  note,
  setNote,
  onAmountChange,
  onAmountConfirm,
  onCommit,
  onReset,
  entryType,
  isCommitting,
}) => {
  const noteInputRef = useRef(null);

  useEffect(() => {
    if (stage === 'note' && noteInputRef.current) {
      setTimeout(() => noteInputRef.current.focus(), 0);
    }
  }, [stage])

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && stage === 'note' && !isCommitting) {
      e.preventDefault();
      onCommit(note); 
    }
  };

  const handleSendClick = () => {
    if (!isCommitting) {
      onCommit(note);
    }
  };

  const formattedAmount =
    amount && !isNaN(amount) ? Number(amount).toFixed(2) : amount;

  return (
    <Paper elevation={3} sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
      <Paper
        variant="outlined"
        sx={{ p: 1, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        {stage === 'note' && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={`₹${formattedAmount}`}
              color={entryType === 'Given' ? 'success' : 'error'}
              size="small"
            />
            <Tooltip title="Start Over">
              <span>
                <IconButton onClick={onReset} size="small" disabled={isCommitting}> 
                  <ReplayIcon fontSize="inherit" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )}

        <TextField
          fullWidth
          variant="standard"
          placeholder={stage === 'amount' ? 'Enter amount...' : 'Add a note... (optional)'}
          value={stage === 'amount' ? amount : note}
          onChange={stage === 'amount' ? handleAmountChange : (e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={stage === 'note' ? noteInputRef : null}
          InputProps={{
            disableUnderline: true,
            startAdornment:
              stage === 'amount' ? <InputAdornment position="start">₹</InputAdornment> : null,
          }}
          inputProps={{ maxLength: 200 }}
          sx={{ flexGrow: 1 }}
          disabled={isCommitting} 
        />

        {stage === 'amount' ? (
          <>
            <Tooltip title="You Lent Money">
              <span>
                <IconButton
                  color="success"
                  onClick={() => onAmountConfirm('Given')}
                  disabled={!amount || Number(amount) === 0 || isCommitting} 
                >
                  <ArrowUpwardIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="You Borrowed Money">
              <span>
                <IconButton
                  color="error"
                  onClick={() => onAmountConfirm('Received')}
                  disabled={!amount || Number(amount) === 0 || isCommitting}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </span>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Confirm Transaction">
            <span> 
              <IconButton
                color="success"
                onClick={handleSendClick}
                disabled={isCommitting} 
              >
                {isCommitting ? ( 
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    <SendIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Paper>
    </Paper>
  );
};