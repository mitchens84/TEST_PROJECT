#!/usr/bin/env python3
"""
Airtable Workflow Data Extractor
--------------------------------
Extracts workflow data from a specified Airtable base and table,
saving it to a JSON file for visualization.

Usage:
    python workflow_extractor.py --base-id BASE_ID --table-id TABLE_ID [--view-id VIEW_ID] [--output OUTPUT]

Example:
    python workflow_extractor.py --base-id appXJL5GujVVKGBSs --table-id tblMFMc0Ej1VjRVtw --view-id viwVJkaHSNGfv91iC
"""

import os
import json
import argparse
import logging
from typing import Dict, List, Any, Optional
import requests
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Extract workflow data from Airtable")
    parser.add_argument("--base-id", required=True, help="Airtable Base ID")
    parser.add_argument("--table-id", required=True, help="Airtable Table ID")
    parser.add_argument("--view-id", help="Airtable View ID (optional)")
    parser.add_argument("--output", default="data/airtable_index_data.json", 
                      help="Output JSON file (default: data/airtable_index_data.json)")
    return parser.parse_args()


def get_airtable_data(base_id: str, table_id: str, view_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Extract data from Airtable using the provided base and table IDs.
    
    Args:
        base_id: The Airtable base ID
        table_id: The Airtable table ID
        view_id: Optional view ID to filter records
        
    Returns:
        Dictionary containing the extracted data
    """
    api_key = os.getenv("AIRTABLE_API_KEY")
    if not api_key:
        raise ValueError("AIRTABLE_API_KEY environment variable not set")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Build the URL
    url = f"https://api.airtable.com/v0/{base_id}/{table_id}"
    if view_id:
        url += f"?view={view_id}"
    
    logger.info(f"Fetching data from Airtable: {url}")
    
    # Make the request
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()


def process_workflow_data(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extracts the records from the raw Airtable data.
    
    Args:
        data: Raw data from Airtable API (which is a dict with a 'records' key)
        
    Returns:
        A list of records.
    """
    records = data.get("records", [])
    logger.info(f"Extracted {len(records)} records")
    
    # Optionally, you can choose to extract only the 'fields' from each record
    # if 'createdTime' and 'id' at the record's root are not needed.
    # For a full dump, just return the records as they are.
    # Example: return [record['fields'] for record in records]
    # For now, let's return the full records including their Airtable IDs and createdTime:
    return records


def save_to_json(data: List[Dict[str, Any]], output_file: str) -> None:
    """
    Save the processed data to a JSON file.
    
    Args:
        data: Processed data to save
        output_file: Path to the output JSON file
    """
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    logger.info(f"Data saved to {output_file}")


def main():
    """Main function to run the script."""
    args = parse_args()
    
    try:
        # Extract data from Airtable
        raw_data = get_airtable_data(args.base_id, args.table_id, args.view_id)
        
        # Process the data for visualization
        processed_data = process_workflow_data(raw_data)
        
        # Save to JSON - Modified to use the output argument directly
        # This allows specifying a path like "data/workflow_data.json" from the command line
        output_path = args.output 
        save_to_json(processed_data, output_path)
        
        print(f"Successfully extracted workflow data and saved to {output_path}")
        
    except Exception as e:
        logger.error(f"Error extracting data: {e}", exc_info=True)
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
